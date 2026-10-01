
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { handleBookSession } from "@/lib/booking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Services = () => {
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [registration, setRegistration] = useState({ name: "", phone: "", intent: "" });

  const servicesList = [
    {
      title: "Individual Therapy",
      description: "One-on-one sessions focused on personal growth and addressing specific challenges.",
      icon: "👤",
      price: "KSh 3,500",
      duration: "50 minutes"
    },
    {
      title: "Couples Counseling",
      description: "Build stronger relationships through guided sessions for partners.",
      icon: "👥",
      price: "KSh 3,500",
      duration: "80 minutes"
    },
    {
      title: "Family Therapy",
      description: "Resolve conflicts and improve communication within family units.",
      icon: "👨‍👩‍👧",
      price: "KSh 3,000", 
      duration: "90 minutes"
    },
    {
      title: "Group Therapy",
      description: "Share experiences and learn from others in a supportive group environment.",
      icon: "👥👥",
      price: "KSh 2,500",
      duration: "120 minutes"
    }
  ];

  const handleEnroll = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEnrolling(true);
    try {
      const { error } = await (supabase as any).from("saturday_sessions_registrations").insert({
        name: registration.name.trim(),
        phone: registration.phone.trim(),
        intent: registration.intent.trim(),
        service_type: "saturday_mentorship",
        is_online: true,
        price: 0,
        deposit: 200,
        is_free_pilot: true,
        status: "pending",
      });

      if (error) throw error;
      setEnrollOpen(false);
      setRegistration({ name: "", phone: "", intent: "" });
      toast.success("Spot reserved! Send KES 200 to confirm. Zoom link will be sent via WhatsApp.");
    } catch (error) {
      console.error("Saturday mentorship reservation failed", error);
      toast.error("Could not reserve your spot. Please try again.");
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
                We offer a range of professional counseling services tailored to your needs. Browse our options below and find the right fit for your journey.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {servicesList.map((service, index) => (
                <Card key={index} className="overflow-hidden bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow">
                  <div className="p-6 md:p-8">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl font-semibold mb-2 text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mt-6">
                      <div>
                        <p className="text-xl font-bold text-primary">{service.price}</p>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                      <Button onClick={handleBookSession} className="bg-primary hover:bg-primary/90 text-primary-foreground">Book Now</Button>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="overflow-hidden bg-card rounded-2xl border-2 border-teal-500/30 shadow-md shadow-primary/10 transition-shadow">
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary" className="gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
                      FREE PILOT
                    </Badge>
                    <Badge variant="secondary" className="gap-2">
                      LIVE ON ZOOM · ONLINE
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm font-semibold text-primary">Free Pilot Launch — Online Live Sessions</p>
                  <h3 className="mb-2 text-2xl font-semibold text-foreground">Saturday Mentorship &amp; Personal Development</h3>
                  <p className="mb-4 text-muted-foreground">Build momentum with practical guidance and a supportive peer group.</p>
                  <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-foreground">
                    <li>Goal Setting &amp; Accountability</li>
                    <li>Weekly Peer Workshops</li>
                    <li>1-on-1 Mentor Check-ins (Google Meet)</li>
                    <li>Recorded replays included</li>
                  </ul>
                  <div className="mb-3 flex flex-wrap items-baseline gap-2">
                    <p className="text-2xl font-bold text-primary">FREE - Pilot Session</p>
                    <p className="text-sm text-muted-foreground line-through">Normally KES 2,000</p>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">KES 200 refundable deposit to reserve (M-Pesa) - refunded after you join live</p>
                  <p className="text-sm text-muted-foreground">This Saturday · 10am-12pm EAT · 20 spots only · Online</p>
                  <div className="mt-6">
                    <Button variant="default" size="lg" className="w-full" onClick={() => setEnrollOpen(true)}>Reserve Free Spot →</Button>
                    <p className="mt-2 text-center text-xs text-muted-foreground">Join from anywhere · Zoom link via WhatsApp</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-6">Not sure which service is right for you?</p>
              <Link to="/contact">
                <Button variant="outline" className="border-primary text-primary hover:bg-secondary">
                  Contact Us for a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve Your Free Spot - Saturday Mentorship</DialogTitle>
            <DialogDescription>Complete your details to reserve a place in the free online pilot.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEnroll}>
            <div className="space-y-2">
              <Label htmlFor="pilot-name">Full Name</Label>
              <Input id="pilot-name" autoComplete="name" required value={registration.name} onChange={(event) => setRegistration({ ...registration, name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pilot-phone">Phone (M-Pesa)</Label>
              <Input id="pilot-phone" type="tel" autoComplete="tel" required value={registration.phone} onChange={(event) => setRegistration({ ...registration, phone: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pilot-intent">What do you want help with?</Label>
              <Textarea id="pilot-intent" required value={registration.intent} onChange={(event) => setRegistration({ ...registration, intent: event.target.value })} />
            </div>
            <div className="rounded-lg border border-border bg-muted p-4 text-sm text-foreground">
              This pilot is FREE. KES 200 deposit confirms your spot and is refunded when you attend live. Lipa na M-Pesa details will be shown after.
            </div>
            <Button type="submit" variant="default" className="w-full" disabled={enrolling}>
              {enrolling ? "Reserving..." : "Reserve Now"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
