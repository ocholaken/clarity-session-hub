import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, HeartHandshake, Home, GraduationCap, Flower2, Briefcase } from "lucide-react";

const services = [
  {
    title: "Individual Counseling",
    description: "One-on-one sessions focused on personal growth, mental health, and overcoming challenges.",
    icon: Heart,
  },
  {
    title: "Couples Therapy",
    description: "Strengthen relationships, improve communication, and resolve conflicts with professional guidance.",
    icon: HeartHandshake,
  },
  {
    title: "Family Counseling",
    description: "Address family dynamics, improve relationships, and create a healthier home environment.",
    icon: Home,
  },
  {
    title: "Student Counseling",
    description: "Support for academic pressure, exam stress, and life decisions for students at every level.",
    icon: GraduationCap,
  },
  {
    title: "Grief Support",
    description: "Compassionate guidance to help you process loss and gently find your way forward.",
    icon: Flower2,
  },
  {
    title: "Career Guidance",
    description: "Navigate career transitions, set goals, and discover your professional purpose and path.",
    icon: Briefcase,
  },
];

const Services = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional counseling services to guide you through life's challenges and support your mental wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group flex flex-col border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#7A9E7E]/50"
            >
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0E9] transition-transform duration-300 group-hover:scale-110">
                  <service.icon className="h-7 w-7 text-[#7A9E7E]" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <CardDescription className="flex-1 text-base text-gray-600">
                  {service.description}
                </CardDescription>
                <Link to="/book" className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full min-h-[44px] border-[#7A9E7E] text-[#3D5A40] hover:bg-[#E8F0E9] transition-transform duration-200 active:scale-[0.98]"
                  >
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
