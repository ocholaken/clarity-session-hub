import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedBookingProps {
  children: ReactNode;
}

const ProtectedBooking = ({ children }: ProtectedBookingProps) => {
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
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedBooking;