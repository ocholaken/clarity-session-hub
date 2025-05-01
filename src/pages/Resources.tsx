
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, Book, FileCheck, Download, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const resources = [
  {
    title: "Understanding Anxiety",
    type: "Article",
    icon: <FileText className="h-6 w-6 text-lavender-500" />,
    description: "Learn about the common symptoms, causes, and effective coping strategies for anxiety.",
    category: "mental-health",
    length: "10 min read",
    link: "#"
  },
  {
    title: "Mindfulness Meditation",
    type: "Video",
    icon: <Video className="h-6 w-6 text-lavender-500" />,
    description: "A guided 10-minute meditation practice to help reduce stress and increase present-moment awareness.",
    category: "mindfulness",
    length: "10:32",
    link: "#"
  },
  {
    title: "Building Resilience",
    type: "Guide",
    icon: <Book className="h-6 w-6 text-lavender-500" />,
    description: "Practical techniques to build emotional resilience and bounce back from life's challenges.",
    category: "self-improvement",
    length: "15 min read",
    link: "#"
  },
  {
    title: "Communication in Relationships",
    type: "Article",
    icon: <FileText className="h-6 w-6 text-lavender-500" />,
    description: "Effective strategies for improving communication with partners, family members, and friends.",
    category: "relationships",
    length: "12 min read",
    link: "#"
  },
  {
    title: "Stress Management Techniques",
    type: "Guide",
    icon: <Book className="h-6 w-6 text-lavender-500" />,
    description: "A comprehensive guide to managing stress through various evidence-based techniques.",
    category: "stress",
    length: "20 min read",
    link: "#"
  },
  {
    title: "Sleep Hygiene Workshop",
    type: "Video",
    icon: <Video className="h-6 w-6 text-lavender-500" />,
    description: "Learn practical tips to improve your sleep quality and establish healthier sleep patterns.",
    category: "wellness",
    length: "25:45",
    link: "#"
  },
  {
    title: "Coping with Grief",
    type: "Article",
    icon: <FileText className="h-6 w-6 text-lavender-500" />,
    description: "Understanding the grief process and healthy ways to cope with loss.",
    category: "mental-health",
    length: "15 min read",
    link: "#"
  },
  {
    title: "Workplace Mental Health",
    type: "Guide",
    icon: <Book className="h-6 w-6 text-lavender-500" />,
    description: "Strategies for maintaining mental wellbeing in professional environments.",
    category: "workplace",
    length: "18 min read",
    link: "#"
  },
  {
    title: "Deep Breathing Exercises",
    type: "Video",
    icon: <Video className="h-6 w-6 text-lavender-500" />,
    description: "A guided session on deep breathing techniques to reduce anxiety and promote relaxation.",
    category: "mindfulness",
    length: "8:15",
    link: "#"
  }
];

const categories = [
  "All",
  "Mental Health",
  "Mindfulness",
  "Self-Improvement",
  "Relationships",
  "Stress",
  "Wellness",
  "Workplace"
];

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-lavender-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Educational Resources</h1>
              <p className="text-xl text-gray-600">
                Explore our collection of articles, videos, and guides designed to support your mental health journey.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="All" className="w-full mb-12">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-gray-100">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="px-4 py-2 data-[state=active]:bg-lavender-100 data-[state=active]:text-lavender-700"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources
                      .filter(resource => 
                        category === "All" || 
                        resource.category.toLowerCase() === category.toLowerCase().replace(" ", "-")
                      )
                      .map((resource, index) => (
                        <Card key={index} className="border border-gray-200 hover:border-lavender-400 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                          <CardHeader>
                            <div className="mb-2">{resource.icon}</div>
                            <CardTitle>{resource.title}</CardTitle>
                            <CardDescription className="text-lavender-600">{resource.type} • {resource.length}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-gray-600 mb-6">{resource.description}</p>
                            <div className="mt-auto">
                              <Button 
                                variant="outline" 
                                className="border-lavender-400 text-lavender-600 hover:bg-lavender-100 w-full"
                              >
                                {resource.type === "Article" || resource.type === "Guide" ? (
                                  <>
                                    <FileCheck className="mr-2 h-4 w-4" /> Read Now
                                  </>
                                ) : resource.type === "Video" ? (
                                  <>
                                    <ExternalLink className="mr-2 h-4 w-4" /> Watch Now
                                  </>
                                ) : (
                                  <>
                                    <Download className="mr-2 h-4 w-4" /> Download
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-6">Need personalized guidance? Our counselors can help.</p>
              <Button className="bg-lavender-500 hover:bg-lavender-600 text-white" onClick={() => window.location.href = "/book"}>
                Book a Session
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
