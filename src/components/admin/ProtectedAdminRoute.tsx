import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

/**
 * Guards every /admin route.
 * - Not signed in  -> /
 * - Signed in but not an admin -> back to the public site
 */
const ProtectedAdminRoute = () => {
  const { session, isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
