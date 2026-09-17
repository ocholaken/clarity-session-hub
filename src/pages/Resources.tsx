import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  FileText,
  HeartHandshake,
  Leaf,
  Lightbulb,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { handleBookSession } from "@/lib/booking";
import { requireResourceAccess } from "@/lib/resourceAccess";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HourlyContentEngine from "@/components/HourlyContentEngine";

type DailyGuide = {
  id: string;
  hour_slot: number;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
};

type ResourceKind = "Guide" | "Article" | "Video";
type ResourceIcon = typeof Brain;

type Resource = {
  id: string;
  title: string;
  kind: ResourceKind;
  topic: string;
  description: string;
  length: string;
  icon: ResourceIcon;
  sections?: { heading: string; text: string }[];
};

const guide = (topic: string, practicalAdvice: string, takeaway: string) => [
  {
    heading: "A helpful starting point",
    text: `This guide offers a calm, practical introduction to ${topic.toLowerCase()}. Use it to notice patterns, identify manageable next steps, and decide what kind of support may be useful.`,
  },
  { heading: "Try this", text: practicalAdvice },
  { heading: "Key takeaway", text: takeaway },
];

const article = (introduction: string, advice: string, takeaway: string) => [
  { heading: "Introduction", text: introduction },
  { heading: "Practical perspective", text: advice },
  { heading: "Key takeaways", text: takeaway },
];

const resources: Resource[] = [
  {
    id: "stress-anxiety-guide",
    title: "Managing Stress and Anxiety",
    kind: "Guide",
    topic: "Mental health",
    description: "A steady, practical guide to recognising stress signals and responding with more choice and self-compassion.",
    length: "12 min read",
    icon: Brain,
    sections: guide("managing stress and anxiety", "Start with a two-minute check-in: name what you are feeling, notice where it shows up in your body, and choose one grounding action such as slower breathing, a short walk, or contacting someone you trust.", "Small, repeatable actions can lower the intensity of stress. Support from a qualified professional is appropriate when anxiety is persistent, worsening, or interfering with daily life."),
  },
  {
    id: "healthy-relationships-guide",
    title: "Building Healthy Relationships",
    kind: "Guide",
    topic: "Relationships",
    description: "Guidance for building trust, communicating clearly, and protecting healthy boundaries in close relationships.",
    length: "10 min read",
    icon: HeartHandshake,
    sections: guide("building healthy relationships", "Use specific, non-blaming language: describe the situation, share its impact on you, and make a clear request. Give the other person room to respond before solving the problem.", "Healthy relationships make space for honesty, repair, respect, and individual needs. Boundaries clarify how people can relate safely."),
  },
  {
    id: "emotional-wellbeing-guide",
    title: "Understanding Emotional Wellbeing",
    kind: "Guide",
    topic: "Wellbeing",
    description: "Learn how emotions, routines, relationships, and personal meaning can influence your overall wellbeing.",
    length: "11 min read",
    icon: Leaf,
    sections: guide("understanding emotional wellbeing", "Build a simple rhythm around sleep, nourishment, movement, connection, and restorative time. Notice how each area affects your energy without treating the record as a test.", "Emotional wellbeing is not constant positivity. It is the capacity to notice feelings, respond to needs, and seek support through ordinary difficulty."),
  },
  {
    id: "life-changes-guide",
    title: "Coping With Life Changes",
    kind: "Guide",
    topic: "Life transitions",
    description: "A compassionate framework for navigating uncertainty, loss, relocation, career shifts, and other major transitions.",
    length: "13 min read",
    icon: Sparkles,
    sections: guide("coping with life changes", "Separate what is within your control from what is not. Keep one familiar routine, identify the next small decision, and tell trusted people what kind of help would be useful.", "Adjustment takes time. Feeling unsettled does not mean you are handling change badly; it can be a normal response to losing certainty or familiarity."),
  },
  {
    id: "children-adolescents-guide",
    title: "Supporting Children and Adolescents",
    kind: "Guide",
    topic: "Family wellbeing",
    description: "Practical guidance for adults supporting young people with emotions, school pressure, friendships, and change.",
    length: "14 min read",
    icon: Users,
    sections: guide("supporting children and adolescents", "Lead with curiosity rather than interrogation. Use age-appropriate language, listen before advising, and create predictable moments for connection. Notice changes over time rather than focusing on one difficult day.", "Young people benefit from patient, consistent adults. When concerns persist or affect safety, learning, sleep, or relationships, involve an appropriate mental health professional."),
  },
  {
    id: "stress-anxiety-article",
    title: "When Stress Starts to Feel Like Too Much",
    kind: "Article",
    topic: "Mental health",
    description: "How to distinguish a demanding season from stress that is beginning to narrow your choices and routines.",
    length: "5 min read",
    icon: FileText,
    sections: article("Stress can be useful in short bursts, but ongoing pressure may affect concentration, sleep, mood, and relationships. Paying attention early creates more options.", "Look for patterns rather than judging yourself. Reduce one avoidable demand, restore one basic routine, and share an honest update with someone supportive.", "Notice changes early, choose one manageable action, and seek professional support when stress is persistent or disruptive."),
  },
  {
    id: "relationship-repair-article",
    title: "The Small Skills That Help Relationships Recover",
    kind: "Article",
    topic: "Relationships",
    description: "Repair after conflict is built through accountability, listening, and consistent follow-through rather than one perfect conversation.",
    length: "6 min read",
    icon: FileText,
    sections: article("Disagreement is a normal part of close relationships. The way people return to the conversation often matters more than avoiding every conflict.", "Name your part without adding a defence, reflect what you heard, and agree on one concrete change to try. If conversations become unsafe or impossible, relationship counseling may offer structure.", "Repair is a process. Respect, accountability, and boundaries create the conditions for trust to grow again."),
  },
  {
    id: "emotional-awareness-article",
    title: "Emotional Awareness Without Self-Criticism",
    kind: "Article",
    topic: "Wellbeing",
    description: "A gentle introduction to naming emotions and responding to them as information rather than a verdict about who you are.",
    length: "5 min read",
    icon: FileText,
    sections: article("Emotions carry information about needs, values, experiences, and perceived safety. They can be important without being instructions that must be acted on immediately.", "Try completing three sentences: I notice..., I may need..., and I can choose.... This creates a pause between feeling and response.", "Curiosity is more useful than criticism. Emotional awareness grows through repeated, compassionate practice."),
  },
  {
    id: "life-transition-article",
    title: "Finding Steadiness During a Transition",
    kind: "Article",
    topic: "Life transitions",
    description: "Why major change can affect identity and energy, and how a few anchors can make uncertainty more manageable.",
    length: "6 min read",
    icon: FileText,
    sections: article("Transitions can change roles, expectations, routines, and the way you understand yourself.", "Choose realistic anchors: a regular meal, a supportive conversation, a short planning window, or a familiar activity. Allow room for mixed feelings.", "You do not need to solve the whole transition today. Stability can begin with one reliable point in the week."),
  },
  {
    id: "adolescent-support-article",
    title: "Listening to a Young Person With Care",
    kind: "Article",
    topic: "Family wellbeing",
    description: "Ways caregivers can make conversations about emotional wellbeing feel safer, more respectful, and more useful.",
    length: "6 min read",
    icon: FileText,
    sections: article("Young people may communicate distress through withdrawal, irritability, changes in routines, or a drop in interest. A calm response can make sharing easier.", "Choose a low-pressure moment, listen without rushing to correct, and ask what support would feel helpful. Keep safety concerns direct and involve appropriate services when needed.", "Connection comes before correction. Consistent listening helps young people feel taken seriously."),
  },
];

const videos: Resource[] = [
  ["anxiety-video", "Understanding Anxiety and Stress", "Mental health", "A planned educational session explaining common stress responses and supportive first steps."],
  ["wellness-video", "Practical Techniques for Emotional Wellness", "Wellbeing", "A planned demonstration of grounding, reflection, and routine-building techniques."],
  ["coping-video", "Building Healthy Coping Strategies", "Life transitions", "A planned educational session on coping strategies that support recovery and flexibility."],
  ["adolescent-video", "Supporting Adolescent Mental Wellbeing", "Family wellbeing", "A planned conversation for caregivers about listening and connecting young people with support."],
  ["support-video", "When to Consider Professional Support", "Mental health", "A planned overview of signs that additional support could be helpful."],
].map(([id, title, topic, description]) => ({
  id,
  title,
  topic,
  description,
  kind: "Video" as const,
  length: "Video resource",
  icon: PlayCircle,
}));

const allResources = [...resources, ...videos];
const tabs = [
  { value: "all", label: "All resources", icon: BookOpen },
  { value: "Guide", label: "Professional guides", icon: ShieldCheck },
  { value: "Article", label: "Professional articles", icon: FileText },
  { value: "Video", label: "Video resources", icon: PlayCircle },
];

const Resources = () => {
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedResource = searchParams.get("resource");
  const [guide, setGuide] = useState<DailyGuide | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchGuide = async () => {
      const hour = new Date().getHours();
      const { data } = await supabase.from("daily_guides").select("*").eq("hour_slot", hour).single();
      setGuide(data);
    };
    fetchGuide();
    const guideInterval = window.setInterval(fetchGuide, 3600000);
    return () => window.clearInterval(guideInterval);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      const seconds = Math.max(0, Math.floor((nextHour.getTime() - now.getTime()) / 1000));
      setTimeLeft(`${Math.floor(seconds / 60)} min ${seconds % 60} sec`);
    };
    updateCountdown();
    const countdownInterval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    if (selectedResource && allResources.some((resource) => resource.id === selectedResource)) {
      setExpandedResource(selectedResource);
    }
  }, [selectedResource]);

  const handleResourceClick = (resourceId: string) => {
    if (expandedResource === resourceId) {
      setExpandedResource(null);
      setSearchParams({}, { replace: true });
      return;
    }

    if (!requireResourceAccess(resourceId)) {
      return;
    }

    setExpandedResource(resourceId);
    setSearchParams({ resource: resourceId }, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative overflow-hidden border-b border-border bg-background py-16 md:py-24">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-secondary/60" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-[#F5EED2]/70 px-4 py-2 text-sm font-semibold text-primary">
                <Lightbulb className="h-4 w-4 text-[#C9A227]" aria-hidden="true" />
                Clarity Session Hub resource library
              </div>
              <h1 className="max-w-2xl text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-5xl">Practical guidance for everyday wellbeing</h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:text-xl">Explore clear, compassionate resources on stress, relationships, emotional wellbeing, life changes, and supporting young people.</p>
              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#6F9085]" />Written for easy reading</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#6F9085]" />Supportive, non-judgmental language</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <HourlyContentEngine />
            </div>
            {guide && (
              <article key={guide.id} className="mb-12 animate-in fade-in rounded-2xl bg-[#6C5CE7] p-6 text-white shadow-xl duration-500 md:p-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">🔥 Guide of the Hour</span><span className="text-sm text-white/80">Next update in: {timeLeft}</span></div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">{guide.category}</p>
                <h2 className="mb-5 text-2xl font-bold md:text-3xl">{guide.title}</h2>
                <div className="max-w-4xl whitespace-pre-line text-sm leading-7 text-white/90 md:text-base">{guide.content}</div>
              </article>
            )}
            <Tabs defaultValue="all" className="w-full">
              <div className="mb-10 flex overflow-x-auto pb-2">
                <TabsList className="h-auto min-w-max gap-1 bg-secondary p-1">
                  {tabs.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger key={value} value={value} className="gap-2 px-4 py-2.5 text-primary data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                      <Icon className="h-4 w-4" aria-hidden="true" />{label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {tabs.map(({ value }) => {
                const visibleResources = allResources.filter((resource) => value === "all" || resource.kind === value);
                return (
                  <TabsContent key={value} value={value} className="mt-0">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {visibleResources.map((resource) => {
                        const ResourceIcon = resource.icon;
                        const isExpanded = expandedResource === resource.id;
                        const isVideo = resource.kind === "Video";
                        return (
                          <Card key={resource.id} className="group flex h-full flex-col overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-[#6F9085]/60 hover:shadow-lg">
                            {isVideo && <div className="relative flex h-40 items-center justify-center overflow-hidden bg-primary"><div className="absolute inset-0 bg-gradient-to-br from-[#174A4A] via-[#174A4A] to-[#6F9085]/70" /><div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A227]/60 bg-[#103838]/70 text-[#C9A227] shadow-lg"><PlayCircle className="h-8 w-8" aria-hidden="true" /></div><span className="absolute bottom-3 left-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Video Resource</span></div>}
                            <CardHeader className="min-w-0 p-5 pb-3 sm:p-6 sm:pb-3">
                              <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between"><span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary"><ResourceIcon className="h-3.5 w-3.5" aria-hidden="true" />{resource.kind}</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{resource.length}</span></div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6F9085]">{resource.topic}</p>
                              <CardTitle className="break-words text-xl leading-snug text-primary">{resource.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col p-5 pt-0 sm:p-6 sm:pt-0">
                              <p className="min-w-0 flex-1 break-words leading-7 text-muted-foreground">{resource.description}</p>
                              {isVideo && isExpanded && <div className="mt-5 rounded-lg border border-[#C9A227]/40 bg-[#F5EED2]/50 p-4 text-sm leading-6 text-primary">This video resource is being prepared. It will be available here when a reviewed video is added.</div>}
                              {isExpanded && resource.sections && <div className="mt-5 space-y-4 border-t border-border pt-5">{resource.sections.map((section) => <div key={section.heading}><h3 className="mb-1 text-sm font-semibold text-primary">{section.heading}</h3><p className="break-words text-sm leading-6 text-muted-foreground">{section.text}</p></div>)}</div>}
                              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                                {isVideo ? <Button variant="outline" onClick={() => handleResourceClick(resource.id)} className="w-full border-primary text-primary hover:bg-secondary sm:w-auto"><PlayCircle className="h-4 w-4" aria-hidden="true" />{isExpanded ? "Close Resource" : "Watch Video"}</Button> : <Button variant="outline" onClick={() => handleResourceClick(resource.id)} className="w-full border-primary text-primary hover:bg-secondary sm:w-auto">{isExpanded ? "Close Resource" : resource.kind === "Guide" ? "Read Guide" : "Read Article"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>}
                                {isVideo && <span className="text-xs font-medium text-muted-foreground">Coming soon</span>}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>

            <div className="mt-16 border-t border-border pt-10 text-center"><p className="mx-auto mb-6 max-w-xl text-muted-foreground">Resources can support reflection, but they are not a substitute for individual assessment or care.</p><Button className="min-h-[48px] bg-primary px-7 text-white hover:bg-[#103838]" onClick={handleBookSession}>Speak with a Counselor<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
