
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import ReviewKeywords from "@/components/ReviewKeywords";

const testimonials = [
  {
    initials: "OK",
    name: "Otieno K.",
    title: "CEO, Nairobi Tech Hub",
    quote: "Working with Dr. Wafula has been transformative. I now lead difficult conversations with more calm, clarity, and confidence.",
    rating: 5,
  },
  {
    initials: "WM",
    name: "Wanjiku M.",
    title: "Entrepreneur, Kapsabet",
    quote: "The couples sessions with Dr. Achieng saved our marriage. We learned to communicate with care instead of carrying stress into every conversation.",
    rating: 5,
  },
  {
    initials: "AO",
    name: "Akinyi O.",
    title: "Business Leader, Eldoret",
    quote: "Clarity Sessions gave me a grounded way to handle leadership pressure while staying present for my family and team.",
    rating: 5,
  },
  {
    initials: "KJ",
    name: "Kamau J.",
    title: "Founder, Nakuru",
    quote: "The sessions helped me separate business urgency from personal worth. I make clearer decisions and recover faster after demanding weeks.",
    rating: 5,
  },
  {
    initials: "NW",
    name: "Njeri W.",
    title: "HR Director, Nairobi",
    quote: "The support has strengthened how I show up for people at work. I feel more equipped to lead with empathy and firm boundaries.",
    rating: 5,
  },
  {
    initials: "KL",
    name: "Kipchoge L.",
    title: "Manager, Nandi Hills",
    quote: "I came in carrying stress from work and family responsibilities. The practical tools made progress feel possible, not abstract.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden bg-[#F9F8FF] py-20">
      <svg className="absolute left-0 right-0 top-0 h-10 w-full text-white" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 0h1440v28c-180 42-300-24-480 4-190 30-300 44-480 0C300-10 170 62 0 30V0Z" /></svg>
      <div className="container relative pt-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#6D28D9]">Voices from Kenya</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real reflections from people building healthier lives, families, teams, and businesses.
          </p>
        </div>

        <ReviewKeywords />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="rounded-2xl border border-purple-50 bg-white shadow-[0_8px_30px_rgba(109,40,217,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(109,40,217,0.16)]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6D28D9] text-sm font-bold text-white shadow-lg">{testimonial.initials}</div>
                  <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="mb-5 text-[15px] leading-7 text-muted-foreground">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-bold text-primary">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <svg className="absolute bottom-0 left-0 right-0 h-10 w-full rotate-180 text-white" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 0h1440v28c-180 42-300-24-480 4-190 30-300 44-480 0C300-10 170 62 0 30V0Z" /></svg>
    </section>
  );
};

export default Testimonials;
