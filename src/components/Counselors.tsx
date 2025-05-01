
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const counselors = [
  {
    name: "Dr. Sarah Johnson",
    title: "Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    specialties: ["Anxiety", "Depression", "Trauma"],
    description: "Dr. Johnson specializes in evidence-based cognitive behavioral therapy with 12+ years of experience helping clients overcome anxiety and depression.",
  },
  {
    name: "Mark Williams, LMFT",
    title: "Marriage & Family Therapist",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    specialties: ["Relationships", "Couples", "Family Dynamics"],
    description: "With a compassionate approach, Mark helps couples and families rebuild communication and strengthen their bonds through proven therapeutic techniques.",
  },
  {
    name: "Dr. Amara Patel",
    title: "Counseling Psychologist",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    specialties: ["Career Development", "Life Transitions", "Stress Management"],
    description: "Dr. Patel blends traditional and modern approaches to help clients navigate major life transitions and professional challenges.",
  },
];

const Counselors = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Counselors</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our team of licensed professionals is committed to providing you with personalized care and support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {counselors.map((counselor, index) => (
            <Card key={index} className="overflow-hidden border border-gray-200 h-full flex flex-col">
              <div className="h-64 overflow-hidden">
                <img 
                  src={counselor.image} 
                  alt={counselor.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{counselor.name}</CardTitle>
                <CardDescription className="text-lavender-600">{counselor.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex gap-2 flex-wrap mb-4">
                  {counselor.specialties.map((specialty, i) => (
                    <span key={i} className="bg-lavender-100 text-lavender-700 px-3 py-1 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600">{counselor.description}</p>
              </CardContent>
              <CardFooter>
                <Link to="/book" className="w-full">
                  <Button variant="outline" className="w-full border-lavender-400 text-lavender-600 hover:bg-lavender-100">
                    Book a Session
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/counselors">
            <Button variant="outline" className="border-lavender-400 text-lavender-600 hover:bg-lavender-100">
              View All Counselors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Counselors;
