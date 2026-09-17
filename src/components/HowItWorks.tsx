import { handleBookSession } from "@/lib/booking";
import { Button } from "@/components/ui/button";
import { ClipboardList, CalendarDays, CreditCard, CheckCircle2 } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const steps = [
  {
    icon: ClipboardList,
    title: "Choose a service",
    text: "Pick individual, couples, family or career counseling.",
  },
  {
    icon: CalendarDays,
    title: "Select a date & time",
    text: "Only free slots are shown, so you never double-book.",
  },
  {
    icon: CreditCard,
    title: "Make payment",
    text: "Pay securely by M-Pesa or card once your slot is held.",
  },
  {
    icon: CheckCircle2,
    title: "Receive confirmation",
    text: "You get a confirmed session and reminders before it starts.",
  },
];

const HowItWorks = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps from first click to a confirmed counseling session.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`relative rounded-2xl bg-card border border-border p-6 shadow-sm transition-all duration-700 ease-out hover:shadow-lg hover:-translate-y-1 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent text-primary mb-4">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-primary mb-1">Step {i + 1}</p>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm">{text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={handleBookSession}
            className="min-h-[48px] px-8 bg-primary hover:bg-[#103838] text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
              Book Your Session
            </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
