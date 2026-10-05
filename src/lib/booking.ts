import { supabase } from "@/integrations/supabase/client";

export const handleBookSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    sessionStorage.setItem("redirectAfterLogin", "/booking");
    window.location.href = "/login";
    return;
  }
  window.location.href = "/booking";
};