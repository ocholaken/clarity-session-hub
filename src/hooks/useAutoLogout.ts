import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LAST_ACTIVITY_KEY = "autoLogoutLastActivity";
const WARNING_BEFORE_LOGOUT_MS = 60_000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

export function useAutoLogout(timeoutMinutes = 15) {
  const navigate = useNavigate();
  const sessionActiveRef = useRef(false);
  const loggingOutRef = useRef(false);
  const warningToastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const timeoutMs = Math.max(1, timeoutMinutes) * 60_000;
    const warningAfterMs = Math.max(0, timeoutMs - WARNING_BEFORE_LOGOUT_MS);
    let warningTimer: ReturnType<typeof setTimeout> | undefined;
    let logoutTimer: ReturnType<typeof setTimeout> | undefined;

    const clearTimers = () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
      warningTimer = undefined;
      logoutTimer = undefined;
    };

    const dismissWarning = () => {
      if (warningToastIdRef.current !== null) {
        toast.dismiss(warningToastIdRef.current);
        warningToastIdRef.current = null;
      }
    };

    const readLastActivity = () => {
      try {
        const storedTime = Number(sessionStorage.getItem(LAST_ACTIVITY_KEY));
        return Number.isFinite(storedTime) && storedTime > 0
          ? Math.min(storedTime, Date.now())
          : null;
      } catch (error) {
        console.error("Unable to read auto-logout activity time", error);
        return null;
      }
    };

    const storeLastActivity = (timestamp: number) => {
      try {
        sessionStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
      } catch (error) {
        console.error("Unable to store auto-logout activity time", error);
      }
    };

    const showWarning = () => {
      dismissWarning();
      warningToastIdRef.current = toast.warning(
        "You will be logged out in 1 minute due to inactivity",
        { duration: WARNING_BEFORE_LOGOUT_MS },
      );
    };

    const logoutForInactivity = async () => {
      if (!sessionActiveRef.current || loggingOutRef.current) return;

      loggingOutRef.current = true;
      sessionActiveRef.current = false;
      clearTimers();
      dismissWarning();

      let signOutError: Error | null = null;
      try {
        const { error } = await supabase.auth.signOut();
        signOutError = error;
      } catch (error) {
        signOutError = error instanceof Error ? error : new Error(String(error));
      }

      if (signOutError) {
        console.error("Unable to sign out after inactivity", signOutError);
      }

      toast.error("Session expired due to inactivity");
      navigate("/login", { replace: true, state: { message: "Session expired due to inactivity" } });
      loggingOutRef.current = false;
    };

    const scheduleLogout = (lastActivity: number) => {
      if (!sessionActiveRef.current || loggingOutRef.current) return;

      clearTimers();
      dismissWarning();

      const elapsedMs = Date.now() - lastActivity;
      const remainingMs = timeoutMs - elapsedMs;
      if (remainingMs <= 0) {
        void logoutForInactivity();
        return;
      }

      if (elapsedMs >= warningAfterMs) {
        showWarning();
      } else {
        warningTimer = setTimeout(() => {
          const latestActivity = readLastActivity();
          if (latestActivity !== null) {
            const elapsedMs = Date.now() - latestActivity;
            if (elapsedMs >= timeoutMs) {
              void logoutForInactivity();
            } else if (elapsedMs >= warningAfterMs) {
              showWarning();
            }
          }
        }, warningAfterMs - elapsedMs);
      }

      logoutTimer = setTimeout(() => {
        const latestActivity = readLastActivity();
        if (latestActivity === null) {
          storeLastActivity(Date.now());
          scheduleLogout(Date.now());
        } else if (Date.now() - latestActivity >= timeoutMs) {
          void logoutForInactivity();
        } else {
          scheduleLogout(latestActivity);
        }
      }, remainingMs);
    };

    const setSessionActive = (active: boolean, resetActivity = false) => {
      sessionActiveRef.current = active;
      if (!active) {
        clearTimers();
        dismissWarning();
        try {
          sessionStorage.removeItem(LAST_ACTIVITY_KEY);
        } catch (error) {
          console.error("Unable to clear auto-logout activity time", error);
        }
        return;
      }

      const lastActivity = resetActivity ? null : readLastActivity();
      const activityTime = lastActivity ?? Date.now();
      if (lastActivity === null) storeLastActivity(activityTime);
      scheduleLogout(activityTime);
    };

    const handleActivity = () => {
      if (!sessionActiveRef.current || loggingOutRef.current) return;
      const timestamp = Date.now();
      const previousActivity = readLastActivity();
      if (previousActivity !== null && timestamp - previousActivity >= timeoutMs) {
        void logoutForInactivity();
        return;
      }
      storeLastActivity(timestamp);
      scheduleLogout(timestamp);
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    let receivedAuthState = false;
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      receivedAuthState = true;
      setSessionActive(Boolean(session), event === "SIGNED_IN");
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Unable to check the current session for auto-logout", error);
        return;
      }
      if (!receivedAuthState) setSessionActive(Boolean(data.session));
    }).catch((error: unknown) => {
      console.error("Unable to check the current session for auto-logout", error);
    });

    return () => {
      clearTimers();
      dismissWarning();
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      authListener.subscription.unsubscribe();
    };
  }, [navigate, timeoutMinutes]);
}
