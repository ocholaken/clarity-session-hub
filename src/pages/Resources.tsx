import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutGrid,
  Brain,
  Flower2,
  TrendingUp,
  HeartHandshake,
  Leaf,
  Building2,
  Clock,
  FileText,
  PlayCircle,
  BookOpen,
} from "lucide-react";

const typeIcons = {
  Article: FileText,
  Video: PlayCircle,
  Guide: BookOpen,
} as const;

type ResourceType = keyof typeof typeIcons;

interface Resource {
  title: string;
  type: ResourceType;
  description: string;
  category: string;
  length: string;
}

const resources: Resource[] = [
  {
    title: "Understanding Anxiety",
    type: "Article",
    description: "Learn about the common symptoms, causes, and effective coping strategies for anxiety.",
    category: "Mental Health",
    length: "10 min read",
  },
  {
    title: "Mindfulness Meditation",
    type: "Video",
    description: "A guided 10-minute meditation practice to help reduce stress and increase present-moment awareness.",
    category: "Mindfulness",
    length: "10 min watch",
  },
  {
    title: "Building Resilience",
    type: "Guide",
    description: "Practical techniques to build emotional resilience and bounce back from life's challenges.",
    category: "Self-Improvement",
    length: "15 min read",
  },
  {
    title: "Communication in Relationships",
    type: "Article",
    description: "Effective strategies for improving communication with partners, family members, and friends.",
    category: "Relationships",
    length: "12 min read",
  },
  {
    title: "Stress Management Techniques",
    type: "Guide",
    description: "A comprehensive guide to managing stress through various evidence-based techniques.",
    category: "Wellness",
    length: "20 min read",
  },
  {
    title: "Sleep Hygiene Workshop",
    type: "Video",
    description: "Learn practical tips to improve your sleep quality and establish healthier sleep patterns.",
    category: "Wellness",
    length: "25 min watch",
  },
  {
    title: "Coping with Grief",
    type: "Article",
    description: "Understanding the grief process and healthy ways to cope with loss.",
    category: "Mental Health",
    length: "15 min read",
  },
  {
    title: "Workplace Mental Health",
    type: "Guide",
    description: "Strategies for maintaining mental wellbeing in professional environments.",
    category: "Workplace",
    length: "18 min read",
  },
  {
    title: "Deep Breathing Exercises",
    type: "Video",
    description: "A guided session on deep breathing techniques to reduce anxiety and promote relaxation.",
    category: "Mindfulness",
    length: "8 min watch",
  },
];

const categories = [
  { label: "All", icon: LayoutGrid },
  { label: "Mental Health", icon: Brain },
  { label: "Mindfulness", icon: Flower2 },
  { label: "Self-Improvement", icon: TrendingUp },
  { label: "Relationships", icon: HeartHandshake },
  { label: "Wellness", icon: Leaf },
  { label: "Workplace", icon: Building2 },
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
              <div className="flex justify-center mb-8 overflow-x-auto">
                <TabsList className="bg-gray-100 h-auto flex-wrap">
                  {categories.map(({ label, icon: Icon }) => (
                    <TabsTrigger
                      key={label}
                      value={label}
                      className="px-4 py-2 gap-2 data-[state=active]:bg-[#E8F0E9] data-[state=active]:text-[#3D5A40]"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map(({ label }) => (
                <TabsContent key={label} value={label}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources
                      .filter((resource) => label === "All" || resource.category === label)
                      .map((resource, index) => {
                        const TypeIcon = typeIcons[resource.type];
                        return (
                          <Card
                            key={index}
                            className="border border-gray-200 hover:border-[#7A9E7E]/60 hover:shadow-md transition-all duration-300 h-full flex flex-col"
                          >
                            <CardHeader>
                              <span className="inline-flex w-fit items-center rounded-full bg-[#C8D8C8] px-3 py-1 text-xs font-semibold text-[#3D5A40] mb-3">
                                {resource.category}
                              </span>
                              <CardTitle>{resource.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col">
                              <p className="text-gray-600 mb-6 flex-1">{resource.description}</p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="inline-flex items-center gap-1.5 text-[#7A9E7E]">
                                  <Clock className="h-4 w-4" aria-hidden="true" />
                                  {resource.length}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-[#6B8CAE] font-medium">
                                  <TypeIcon className="h-4 w-4" aria-hidden="true" />
                                  {resource.type}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-6">Need personalized guidance? Our counselors can help.</p>
              <Button
                className="min-h-[48px] bg-lavender-500 hover:bg-lavender-600 text-white"
                onClick={() => (window.location.href = "/book")}
              >
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
