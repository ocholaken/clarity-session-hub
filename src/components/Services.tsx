import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ServiceDirectory from "@/components/ServiceDirectory";
import type { CatalogService } from "@/lib/service-catalog";

const Services = () => {
  const navigate = useNavigate();

  const handleBookNow = async (service: CatalogService) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      localStorage.setItem("pending_booking_service", JSON.stringify(service));
      sessionStorage.setItem("redirectAfterLogin", "/booking");
      window.location.href = "/login";
      return;
    }
    navigate(`/booking?service=${encodeURIComponent(service.id)}`);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Counseling, therapy, and school-based wellbeing programs tailored to individuals, families, and learning communities.
          </p>
        </div>

        <ServiceDirectory onBook={handleBookNow} />
        <div className="mt-6 px-4 sm:px-0">
          <Card
            id="free-online-coaching"
            className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-2 border-teal-500/30 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="p-0">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent transition-transform duration-300 group-hover:scale-110">
                <span className="text-2xl" aria-hidden="true">🎥</span>
              </div>
              <CardTitle className="text-xl">Free Saturday Coaching (30 min)</CardTitle>
              <CardDescription>One-to-one online coaching, free to reserve. No payment required.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 p-0 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-2xl font-bold text-primary">FREE</p>
              <Button onClick={() => navigate("/services?service=free-online-coaching")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Reserve Free Spot
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;
