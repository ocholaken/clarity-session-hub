import { Link } from "react-router-dom";
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
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-lg text-gray-600">
            Four simple steps from first click to a confirmed counseling session.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`relative rounded-2xl bg-white border border-gray-100 p-6 shadow-sm transition-all duration-700 ease-out hover:shadow-lg hover:-translate-y-1 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-lavender-100 text-lavender-600 mb-4">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-lavender-500 mb-1">Step {i + 1}</p>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            className="min-h-[48px] px-8 bg-lavender-500 hover:bg-lavender-600 text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <Link to="/book">Book Your Session</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
