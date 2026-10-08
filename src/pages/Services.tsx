
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ServiceDirectory from "@/components/ServiceDirectory";
import type { CatalogService } from "@/lib/service-catalog";

type FreeReservationPayload = Record<string, unknown>;
type FreeReservationClient = {
  from: (table: "bookings") => {
    insert: (values: FreeReservationPayload[]) => PromiseLike<{
      error: { message: string } | null;
    }>;
  };
};

const Services = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [registration, setRegistration] = useState({ name: "", phone: "", intent: "" });

  useEffect(() => {
    if (searchParams.get("service") === "free-online-coaching") {
      setEnrollOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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

  const handleEnroll = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (registration.phone.trim().length < 10) {
      toast.error("Phone required! Enter e.g. 0712345678");
      return;
    }
    setEnrolling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        sessionStorage.setItem("redirectAfterLogin", "/services?service=free-online-coaching");
        window.location.href = "/login";
        return;
      }
      const nextSaturday = new Date();
      const daysUntilSaturday = (6 - nextSaturday.getDay() + 7) % 7 || 7;
      nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);
      nextSaturday.setHours(10, 0, 0, 0);
      const bookingDate = nextSaturday.toISOString();
      const booking = {
        user_id: user.id,
        customer_name: registration.name.trim(),
        customer_email: user.email ?? "",
        customer_phone: registration.phone.trim(),
        client_name: registration.name.trim(),
        client_email: user.email ?? "",
        client_phone: registration.phone.trim(),
        counselor_name: "Free Saturday Coaching (30 min) - Free",
        service_name: "Free Saturday Coaching (30 min) - Free",
        service_category: "online",
        is_free: true,
        booking_date: bookingDate,
        booking_time: "10:00 AM",
        service_type: "online_coaching",
        is_online: true,
        is_free_pilot: true,
        price: 0,
        intent: registration.intent.trim() || "Online coaching",
        status: "pending",
      };
      const { error } = await (supabase as unknown as FreeReservationClient)
        .from("bookings")
        .insert([booking]);

      if (error) {
        console.error("Online coaching reservation failed", error);
        toast.error(`Booking failed: ${error.message}`);
        return;
      }

      setEnrollOpen(false);
      setRegistration({ name: "", phone: "", intent: "" });
      const result = { success: true, message: "Free Saturday coaching spot reserved!" };
      toast.success(result.message);
      return result;
    } catch (error) {
      console.error("Online coaching reservation failed", error);
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-muted">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Our Services</h1>
              <p className="text-xl text-muted-foreground">
                Explore our counseling and therapy services, or reserve a free online coaching session.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <ServiceDirectory onBook={handleBookNow} />
            <div className="mt-6 px-4 sm:px-0">
              <Card id="free-online-coaching" className="mx-auto max-w-3xl overflow-hidden rounded-2xl border-2 border-teal-500/30 bg-card p-5 shadow-md shadow-primary/10 transition-shadow">
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary" className="gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
                      FREE
                    </Badge>
                    <Badge variant="secondary" className="gap-2">
                      ONLINE COACHING
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold text-foreground">Free Saturday Coaching (30 min)</h3>
                  <p className="mb-4 text-muted-foreground">One-to-one online coaching to help you build clarity, confidence, and momentum.</p>
                  <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-foreground">
                    <li>Personalized online session</li>
                    <li>Goal setting and practical next steps</li>
                    <li>Free reservation</li>
                  </ul>
                  <p className="mb-4 text-2xl font-bold text-primary">FREE</p>
                  <div className="mt-6">
                    <Button variant="default" size="lg" className="w-full py-3 active:scale-95" onClick={() => setEnrollOpen(true)}>Reserve Free Spot</Button>
                    <p className="mt-2 text-center text-xs text-muted-foreground">No payment required</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/contact">
                <Button variant="outline" className="border-primary text-primary hover:bg-secondary">Questions? Contact us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent className="fixed inset-x-0 bottom-0 top-auto max-h-[90dvh] translate-x-0 translate-y-0 overflow-y-auto rounded-t-2xl p-4 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:bottom-auto sm:max-h-[90vh] sm:max-w-lg sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:p-6">
          <DialogHeader>
            <DialogTitle>Reserve Free Saturday Coaching (30 min)</DialogTitle>
            <DialogDescription>Complete your details to reserve your free Saturday online coaching session. No payment is required.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEnroll}>
            <div className="space-y-2">
              <Label htmlFor="pilot-name">Full Name</Label>
              <Input className="text-base" id="pilot-name" autoComplete="name" required value={registration.name} onChange={(event) => setRegistration({ ...registration, name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pilot-phone">Phone</Label>
              <Input className="text-base" id="pilot-phone" name="phone" type="tel" autoComplete="tel" required value={registration.phone} onChange={(event) => setRegistration({ ...registration, phone: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pilot-intent">What would you like to focus on?</Label>
              <Textarea className="text-base" id="pilot-intent" required value={registration.intent} onChange={(event) => setRegistration({ ...registration, intent: event.target.value })} />
            </div>
            <div className="rounded-lg border border-border bg-muted p-4 text-sm text-foreground">This online coaching session is free. No payment is required.</div>
            <Button type="submit" variant="default" className="w-full" disabled={enrolling}>
              {enrolling ? "Reserving..." : "Reserve Free Spot"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
