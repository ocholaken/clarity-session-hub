import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const navigate = useNavigate();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      if (profile?.role !== "admin") {
        navigate("/", { replace: true });
        return;
      }

      setAllowed(true);
      setCheckingAccess(false);
    };

    void checkAccess();
    return () => {
      active = false;
    };
  }, [navigate]);

  if (checkingAccess || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return <AdminDashboard />;
};

export default Admin;