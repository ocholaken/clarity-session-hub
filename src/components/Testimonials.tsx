
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jason R.",
    title: "Marketing Director",
    quote: "Working with Dr. Johnson has been transformative. Her guidance helped me overcome anxiety issues that I've struggled with for years.",
    rating: 5,
  },
  {
    name: "Michelle K.",
    title: "Teacher",
    quote: "The couples sessions with Mark saved our marriage. We've developed better communication skills and understanding of each other.",
    rating: 5,
  },
  {
    name: "David T.",
    title: "Software Engineer",
    quote: "Dr. Patel's career counseling gave me clarity during a difficult transition period. Her insights were practical and effective.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    title: "Healthcare Professional",
    quote: "I've tried several therapists before, but Clarity Sessions provided the most comfortable and productive experience I've had.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 subtle-gradient">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about their experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border border-gray-100">
              <CardHeader className="pb-2">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
