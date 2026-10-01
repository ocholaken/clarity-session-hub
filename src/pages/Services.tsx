
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { handleBookSession } from "@/lib/booking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const Services = () => {
  const navigate = useNavigate();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollmentPlan, setEnrollmentPlan] = useState<"single" | "program">("program");
  const [enrolling, setEnrolling] = useState(false);

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

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to book an online session");
        navigate("/login", { state: { from: "/services" } });
        return;
      }

      const nextSaturday = new Date();
      const daysUntilSaturday = (6 - nextSaturday.getDay() + 7) % 7 || 7;
      nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);
      const bookingDate = `${nextSaturday.getFullYear()}-${String(nextSaturday.getMonth() + 1).padStart(2, "0")}-${String(nextSaturday.getDate()).padStart(2, "0")}`;
      const amount = enrollmentPlan === "program" ? 6000 : 2000;
      const { error } = await (supabase as any).from("bookings").insert({
        user_id: user.id,
        counselor_name: "Saturday Mentorship & Personal Development",
        booking_date: bookingDate,
        booking_time: "10:00 AM EAT",
        service_type: "saturday_mentorship",
        is_online: true,
        amount,
        status: "pending",
      });

      if (error) throw error;
      setEnrollOpen(false);
      toast.success("Your online session enrollment is pending confirmation");
      navigate("/my-bookings");
    } catch (error) {
      console.error("Saturday mentorship enrollment failed", error);
      toast.error("Could not create your booking. Please try again.");
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

              <Card className="overflow-hidden bg-card rounded-2xl border-2 border-primary shadow-md shadow-primary/10 transition-shadow">
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary">ONLINE</Badge>
                    <Badge variant="secondary" className="gap-2">
                      <span className="h-2 w-2 rounded-full bg-teal-500" aria-hidden="true" />
                      LIVE ON ZOOM
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm font-semibold text-primary">Online Live Sessions</p>
                  <h3 className="mb-2 text-2xl font-semibold text-foreground">Saturday Mentorship &amp; Personal Development</h3>
                  <p className="mb-4 text-muted-foreground">Build momentum with practical guidance and a supportive peer group.</p>
                  <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-foreground">
                    <li>Goal Setting &amp; Accountability</li>
                    <li>Weekly Peer Workshops</li>
                    <li>1-on-1 Mentor Check-ins</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">Every Saturday · 10am-12pm EAT · 6-week program</p>
                  <div className="mt-6 flex items-center justify-end">
                    <Button variant="default" onClick={() => setEnrollOpen(true)}>Enroll Now</Button>
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
            <DialogTitle>Saturday Mentorship &amp; Personal Development</DialogTitle>
            <DialogDescription>Online live sessions every Saturday, 10am-12pm EAT.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Choose enrollment option">
              <Button type="button" variant={enrollmentPlan === "single" ? "default" : "outline"} onClick={() => setEnrollmentPlan("single")}>
                Single Saturday · KES 2,000
              </Button>
              <Button type="button" variant={enrollmentPlan === "program" ? "default" : "outline"} onClick={() => setEnrollmentPlan("program")}>
                6 weeks · KES 6,000
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Platform: Zoom &amp; Google Meet · Join from anywhere.</p>
            <Button type="button" variant="default" className="w-full" disabled={enrolling} onClick={() => void handleEnroll()}>
              {enrolling ? "Booking..." : "Book Online Session"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
