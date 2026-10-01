import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "visitor_id";
const LEGACY_STORAGE_KEY = "clarity_visitor_id";
const SESSION_KEY = "clarity_session_id";

export const getOrCreateVisitorId = () => {
  if (typeof window === "undefined") return null;

  let visitorId = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
  }
  window.localStorage.setItem(STORAGE_KEY, visitorId);
  window.localStorage.setItem(LEGACY_STORAGE_KEY, visitorId);

  return visitorId;
};

const getSessionId = () => {
  if (typeof window === "undefined") return null;

  let sessionId = window.localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

const recordPageView = async (page: string, scrollDepth: number | null = null) => {
  const sessionId = getSessionId();
  if (!sessionId) return;

  const { error } = await (supabase as any).from("page_views").insert({
    page,
    session_id: sessionId,
  });

  if (error) console.warn("Page view tracking failed:", error);
};

const detectBrowser = () => {
  const userAgent = navigator.userAgent || "";
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|crios/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent)) return "Safari";
  if (/opr/i.test(userAgent)) return "Opera";
  return "Unknown";
};

const detectOS = () => {
  const userAgent = navigator.userAgent || "";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os/i.test(userAgent)) return "macOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Unknown";
};

export const trackAnonymousEvent = async (
  actionType: string,
  pageUrl: string,
  counselorId?: string,
  scrollDepth?: number,
) => {
  const visitorId = getOrCreateVisitorId();
  const sessionId = getSessionId();
  if (!visitorId || !sessionId) return;

  const userAgent = navigator.userAgent || "Unknown";
  try {
    const { error } = await supabase.functions.invoke("track-anonymous-activity", {
      body: {
        visitor_id: visitorId,
        session_id: sessionId,
        action_type: actionType,
        page_url: pageUrl,
        counselor_id: counselorId || null,
        scroll_depth: scrollDepth ?? null,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString(),
        device: userAgent.slice(0, 100),
        browser: detectBrowser(),
        os: detectOS(),
        metadata: { page_title: document.title },
      },
    });

    if (error) console.warn("Anonymous tracking failed:", error);
  } catch (error) {
    console.warn("Anonymous tracking failed:", error);
  }
};

export const trackCounselorView = (counselorId: string) =>
  trackAnonymousEvent("counselor_view", `${window.location.pathname}${window.location.search}`, counselorId);

export const useAnonymousTracking = () => {
  const location = useLocation();
  const lastTrackedRoute = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pageUrl = `${location.pathname}${location.search}`;
    if (lastTrackedRoute.current !== pageUrl) {
      lastTrackedRoute.current = pageUrl;
      void recordPageView(location.pathname);
    }

    let trackedHalfway = false;
    const onScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollableHeight > 0 ? Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100)) : 100;
      if (!trackedHalfway && depth >= 50) {
        trackedHalfway = true;
        void recordPageView(location.pathname, 50);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [location.pathname, location.search]);
};
