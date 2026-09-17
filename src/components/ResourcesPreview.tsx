
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PlayCircle, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { requireResourceAccess } from "@/lib/resourceAccess";

const resources = [
  {
    id: "stress-anxiety-article",
    title: "Understanding Anxiety",
    type: "Article",
    icon: <FileText className="h-6 w-6 text-[#6F9085]" />,
    description: "Learn about the common symptoms, causes, and effective coping strategies for anxiety.",
  },
  {
    id: "wellness-video",
    title: "Mindfulness Meditation",
    type: "Video",
    icon: <PlayCircle className="h-6 w-6 text-[#6F9085]" />,
    description: "A guided 10-minute meditation practice to help reduce stress and increase present-moment awareness.",
  },
  {
    id: "emotional-wellbeing-guide",
    title: "Building Resilience",
    type: "Guide",
    icon: <BookOpen className="h-6 w-6 text-[#6F9085]" />,
    description: "Practical techniques to build emotional resilience and bounce back from life's challenges.",
  },
];

const ResourcesPreview = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Educational Resources</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of articles, videos, and guides designed to support your mental health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {resources.map((resource, index) => (
            <Card key={index} className="border border-border hover:border-primary hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="mb-2">{resource.icon}</div>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription className="text-primary">{resource.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{resource.description}</p>
              </CardContent>
              <CardFooter>
                <button
                  type="button"
                  onClick={() => requireResourceAccess(resource.id)}
                  className="inline-flex items-center text-primary transition-colors hover:text-primary/80"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/resources">
            <Button className="bg-lavender-500 hover:bg-lavender-600 text-white">
              Explore All Resources
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResourcesPreview;
