import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { handleBookSession } from "@/lib/booking";
import { BadgeCheck, Globe, Banknote, CalendarCheck } from "lucide-react";
import sarahImage from "../../Sarah Akoth.jpg";
import paulineImage from "../../Pauline Oyuga.jpg";
import anneImage from "../../counselor1.jpg.jpeg";

const counselors = [
  {
    name: "Dr. Sarah Johnson",
    title: "Clinical Psychologist",
    image: sarahImage,
    specialties: ["Anxiety", "Depression", "Trauma"],
    description: "Dr. Johnson specializes in evidence-based cognitive behavioral therapy with 12+ years of experience helping clients overcome anxiety and depression.",
    languages: "English, Swahili",
    price: "KSh 3,500 / session",
    availability: "Mon – Fri",
  },
  {
    name: "Mark Williams, LMFT",
    title: "Marriage & Family Therapist",
    image: paulineImage,
    specialties: ["Relationships", "Couples", "Family Dynamics"],
    description: "With a compassionate approach, Mark helps couples and families rebuild communication and strengthen their bonds through proven therapeutic techniques.",
    languages: "English",
    price: "KSh 4,000 / session",
    availability: "Tue – Sat",
  },
  {
    name: "Dr. Amara Patel",
    title: "Counseling Psychologist",
    image: anneImage,
    specialties: ["Career Development", "Life Transitions", "Stress Management"],
    description: "Dr. Patel blends traditional and modern approaches to help clients navigate major life transitions and professional challenges.",
    languages: "English, Hindi",
    price: "KSh 3,500 / session",
    availability: "Mon – Sat",
  },
];

const Counselors = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Counselors</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our team of licensed professionals is committed to providing you with personalized care and support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {counselors.map((counselor, index) => (
            <Card key={index} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm h-full flex flex-col transition-shadow duration-300 hover:shadow-lg">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={counselor.image} 
                  alt={counselor.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-accent text-primary px-3 py-1 text-xs font-semibold shadow">
                  <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Verified
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{counselor.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{counselor.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex gap-2 flex-wrap mb-4">
                  {counselor.specialties.map((specialty, i) => (
                    <span key={i} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{counselor.description}</p>
                <dl className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <dd>{counselor.languages}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <dd>{counselor.price}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <dd>{counselor.availability}</dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter>
                <Button onClick={handleBookSession} variant="outline" className="w-full min-h-[44px] border-primary text-primary hover:bg-secondary transition-transform duration-200 active:scale-[0.98]">
                    Book a Session
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/counselors">
            <Button variant="outline" className="min-h-[44px] border-primary text-primary hover:bg-secondary">
              View All Counselors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Counselors;
