
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";
import { handleBookSession } from "@/lib/booking";
import kennethImage from "./kenneth.jpg";
import sarahImage from "../../Sarah Akoth.jpg";
import anneImage from "../../counselor1.jpg.jpeg";
import bellaImage from "../../Bela.jpg";
import paulineImage from "../../Pauline Oyuga.jpg";

const counselors = [
  // {
  //   name: "Dr. Sarah Johnson",
  //   title: "Clinical Psychologist",
  //   image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  //   specialties: ["Anxiety", "Depression", "Trauma"],
  //   description: "Dr. Johnson specializes in evidence-based cognitive behavioral therapy with 12+ years of experience helping clients overcome anxiety and depression.",
  //   education: "Ph.D. in Clinical Psychology, Stanford University",
  //   experience: "12+ years",
  //   rating: 4.9,
  //   reviews: 124,
  //   availabilityMessage: "Available next week"
  // },
  {
    name: " Dr.Pauline Oyuga",
    title: "Counselor",
    image: paulineImage,
    specialties: ["Wellbeing", "Life Transitions", "Supportive Counseling"],
    description: "Pauline Oyuga is currently working in Sunderland, UK, supporting people with a compassionate and practical approach.",
    education: "Masters in Counseling Psychology, University of Sunderland",
    experience: "7+ years",
    rating: 3.0,
    reviews: 66,
    availabilityMessage: "Available this week"
  },
  {
    name: "Anne Wagude",
    title: "Counseling Psychologist",
    image: anneImage,
    specialties: ["  Teen and Adolescent . Grief and Trauma . Psychological Debrifing"],
    description: "Dr. Wagude blends traditional and modern approaches to help clients navigate major life transitions and professional challenges.",
    education: "D. in Counseling Psychology, KIPC",
    experience: "8+ years",
    rating: 3.7,
    reviews: 50,
    availabilityMessage: "Available tomorrow"
  },
  {
    name: "Kenneth Ochola, LPC",
    title: "Psychologist, Frontend Developer & AI Architect",
    image: kennethImage,
    specialties: ["Psychological Intelligence", "Frontend Engineering", "AI Architecture"],
    description: "I am a Psychologist by training, a Frontend Developer by craft, and an AI Architect by vision. As Co-Founder of Clarity Session Hub and CEO of Clarity, I build psychologically intelligent, beautifully crafted, human-centered ecosystems where technology understands people.",
    education: "Psychologist by training",
    experience: "Co-Founder, Clarity Session Hub | CEO, Clarity",
    rating: 4.9,
    reviews: 50,
    availabilityMessage: "Limited availability"
  },
  {
    name: "Bella Linda",
    title: "Child & Adolescent Psychologist",
    image: bellaImage,
    specialties: ["Child Development", "ADHD", "School Issues"],
    description: "Dr.Linda has dedicated her career to supporting children, adolescents, and their families through developmental challenges and school-related issues.",
    education: "BA. in Child Psychology, University of Maseno",
    experience: "4+ years",
    rating: 4.8,
    reviews: 58,
    availabilityMessage: "Available next week"
  },
  {
    name: "Sarah Akoth",
    title: "Bachelor in Counseling Psychology",
    image: sarahImage,
    specialties: ["Grief & Loss", "PTSD", "Veterans"],
    description: "Sarah provides compassionate support for those dealing with grief, loss, and trauma, with a special focus on veterans and military families.",
    education: "Mku, University",
    experience: "3+ years",
    rating: 4.9,
    reviews: 49,
    availabilityMessage: "Available this week"
  }
];

const specialtyOptions = [
  "All Specialties",
  "Anxiety",
  "Depression",
  "Trauma",
  "Relationships",
  "Family Dynamics",
  "Career Development",
  "Stress Management",
  "Addiction Recovery",
  "Mindfulness",
  "Child Development",
  "Grief & Loss",
  "PTSD"
];

const CounselorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");

  const filteredCounselors = counselors.filter(counselor => {
    const matchesSearch = counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         counselor.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === "All Specialties" || 
                            counselor.specialties.some(s => s === selectedSpecialty);
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <Header />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-muted">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Counselors</h1>
              <p className="text-xl text-muted-foreground">
                Meet our team of licensed professionals dedicated to supporting your mental health journey.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by name or keywords..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <select
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {specialtyOptions.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
              {filteredCounselors.map((counselor, index) => (
                <Card key={index} className="flex flex-col h-full w-full overflow-hidden rounded-xl shadow-sm">
                  <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    <img 
                      src={counselor.image} 
                      alt={counselor.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 ${counselor.name === "Dr. Bella Linda" ? "scale-[1.22] hover:scale-[1.27]" : "hover:scale-105"}`}
                      style={{ objectPosition: counselor.name === "Dr. Bella Linda" ? "50% 55%" : "50% 0%" }}
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-4 md:p-6">
                    <CardHeader className="p-0">
                      <CardTitle className="text-xl">{counselor.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">{counselor.title}</CardDescription>
                      <div className="flex items-center mt-2 text-amber-500">
                        <Star className="fill-current h-4 w-4" />
                        <span className="ml-1 text-sm font-medium">{counselor.rating}</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{counselor.reviews} reviews</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                      <div className="flex gap-2 flex-wrap mb-4">
                        {counselor.specialties.map((specialty, i) => (
                          <span key={i} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4">{counselor.description}</p>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Education:</span> {counselor.education}</p>
                        <p><span className="font-medium">Experience:</span> {counselor.experience}</p>
                        <p className="text-green-600 font-medium mt-4">{counselor.availabilityMessage}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="mt-auto flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 px-0 pb-0">
                      <Button onClick={handleBookSession} className="w-full sm:w-auto flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Session
                        </Button>
                      <Button variant="outline" className="w-full sm:w-auto flex-1 border-primary text-primary hover:bg-secondary">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>

            {filteredCounselors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">No counselors found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-lavender-400 text-lavender-600 hover:bg-lavender-100"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSpecialty("All Specialties");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CounselorsPage;
