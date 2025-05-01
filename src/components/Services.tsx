
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Lightbulb, Briefcase, Brain, Moon } from "lucide-react";

const services = [
  {
    title: "Individual Counseling",
    description: "One-on-one sessions focused on personal growth, mental health, and overcoming challenges.",
    icon: <Heart className="h-10 w-10 text-lavender-500" />,
    color: "bg-soft-pink",
  },
  {
    title: "Couples Therapy",
    description: "Strengthen relationships, improve communication, and resolve conflicts with professional guidance.",
    icon: <Users className="h-10 w-10 text-lavender-500" />,
    color: "bg-soft-blue",
  },
  {
    title: "Family Counseling",
    description: "Address family dynamics, improve relationships, and create a healthier home environment.",
    icon: <Lightbulb className="h-10 w-10 text-lavender-500" />,
    color: "bg-soft-green",
  },
  {
    title: "Career Guidance",
    description: "Navigate career transitions, set goals, and discover your professional purpose and path.",
    icon: <Briefcase className="h-10 w-10 text-lavender-500" />,
    color: "bg-peach-200",
  },
  {
    title: "Stress Management",
    description: "Learn practical strategies to manage stress, anxiety, and build resilience in daily life.",
    icon: <Brain className="h-10 w-10 text-lavender-500" />,
    color: "bg-lavender-100",
  },
  {
    title: "Wellness Coaching",
    description: "Holistic guidance for improving overall wellbeing, habits, and lifestyle balance.",
    icon: <Moon className="h-10 w-10 text-lavender-500" />,
    color: "bg-soft-gray",
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
            <Card key={index} className="overflow-hidden border border-gray-200 hover:border-lavender-400 hover:shadow-md transition-all duration-300">
              <CardHeader className={`${service.color} p-6`}>
                <div className="mb-4">{service.icon}</div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription className="text-base text-gray-600">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
