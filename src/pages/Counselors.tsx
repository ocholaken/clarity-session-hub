
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const counselors = [
  {
    name: "Dr. Sarah Johnson",
    title: "Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    specialties: ["Anxiety", "Depression", "Trauma"],
    description: "Dr. Johnson specializes in evidence-based cognitive behavioral therapy with 12+ years of experience helping clients overcome anxiety and depression.",
    education: "Ph.D. in Clinical Psychology, Stanford University",
    experience: "12+ years",
    rating: 4.9,
    reviews: 124,
    availabilityMessage: "Available next week"
  },
  {
    name: "Mark Williams, LMFT",
    title: "Marriage & Family Therapist",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    specialties: ["Relationships", "Couples", "Family Dynamics"],
    description: "With a compassionate approach, Mark helps couples and families rebuild communication and strengthen their bonds through proven therapeutic techniques.",
    education: "M.S. in Marriage and Family Therapy, UCLA",
    experience: "8+ years",
    rating: 4.8,
    reviews: 97,
    availabilityMessage: "Available this week"
  },
  {
    name: "Dr. Amara Patel",
    title: "Counseling Psychologist",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    specialties: ["Career Development", "Life Transitions", "Stress Management"],
    description: "Dr. Patel blends traditional and modern approaches to help clients navigate major life transitions and professional challenges.",
    education: "Psy.D. in Counseling Psychology, Columbia University",
    experience: "10+ years",
    rating: 4.7,
    reviews: 86,
    availabilityMessage: "Available tomorrow"
  },
  {
    name: "James Chen, LPC",
    title: "Licensed Professional Counselor",
    image: "https://images.unsplash.com/photo-1542190891-2093d38760f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    specialties: ["Addiction Recovery", "Mindfulness", "Men's Issues"],
    description: "James specializes in addiction recovery and mindfulness-based interventions, helping clients develop healthier coping mechanisms and lifestyle habits.",
    education: "M.A. in Clinical Mental Health Counseling, NYU",
    experience: "9+ years",
    rating: 4.9,
    reviews: 112,
    availabilityMessage: "Limited availability"
  },
  {
    name: "Dr. Lisa Rodriguez",
    title: "Child & Adolescent Psychologist",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    specialties: ["Child Development", "ADHD", "School Issues"],
    description: "Dr. Rodriguez has dedicated her career to supporting children, adolescents, and their families through developmental challenges and school-related issues.",
    education: "Ph.D. in Child Psychology, University of Michigan",
    experience: "15+ years",
    rating: 4.8,
    reviews: 148,
    availabilityMessage: "Available next week"
  },
  {
    name: "Robert Taylor, LCSW",
    title: "Licensed Clinical Social Worker",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    specialties: ["Grief & Loss", "PTSD", "Veterans"],
    description: "Robert provides compassionate support for those dealing with grief, loss, and trauma, with a special focus on veterans and military families.",
    education: "MSW, University of Washington",
    experience: "11+ years",
    rating: 4.9,
    reviews: 91,
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-lavender-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Counselors</h1>
              <p className="text-xl text-gray-600">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCounselors.map((counselor, index) => (
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
                    <div className="flex items-center mt-2 text-amber-500">
                      <Star className="fill-current h-4 w-4" />
                      <span className="ml-1 text-sm font-medium">{counselor.rating}</span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{counselor.reviews} reviews</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex gap-2 flex-wrap mb-4">
                      {counselor.specialties.map((specialty, i) => (
                        <span key={i} className="bg-lavender-100 text-lavender-700 px-3 py-1 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">{counselor.description}</p>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Education:</span> {counselor.education}</p>
                      <p><span className="font-medium">Experience:</span> {counselor.experience}</p>
                      <p className="text-green-600 font-medium mt-4">{counselor.availabilityMessage}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Link to="/book" className="w-full">
                      <Button className="w-full bg-lavender-500 hover:bg-lavender-600 text-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Session
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full border-lavender-400 text-lavender-600 hover:bg-lavender-100">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </CardFooter>
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
