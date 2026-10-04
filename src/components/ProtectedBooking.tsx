import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedBookingProps {
  children: ReactNode;
}

const ProtectedBooking = ({ children }: ProtectedBookingProps) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(Boolean(data.user));
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-lavender-600" />
      </div>
    );
  }

  if (!isLoggedIn) {
    const returnTo = `${location.pathname}${location.search}`;
    sessionStorage.setItem("redirectAfterLogin", returnTo);
    return <Navigate to={`/login?redirect=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedBooking;