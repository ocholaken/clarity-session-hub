
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { handleBookSession } from "@/lib/booking";

const Services = () => {
  const servicesList = [
    {
      title: "Individual Therapy",
      description: "One-on-one sessions focused on personal growth and addressing specific challenges.",
      icon: "👤",
      price: "$85",
      duration: "50 minutes"
    },
    {
      title: "Couples Counseling",
      description: "Build stronger relationships through guided sessions for partners.",
      icon: "👥",
      price: "$120",
      duration: "80 minutes"
    },
    {
      title: "Family Therapy",
      description: "Resolve conflicts and improve communication within family units.",
      icon: "👨‍👩‍👧",
      price: "$150", 
      duration: "90 minutes"
    },
    {
      title: "Group Therapy",
      description: "Share experiences and learn from others in a supportive group environment.",
      icon: "👥👥",
      price: "$60",
      duration: "120 minutes"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-muted">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Our Services</h1>
              <p className="text-xl text-muted-foreground">
                We offer a range of professional counseling services tailored to your needs. Browse our options below and find the right fit for your journey.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {servicesList.map((service, index) => (
                <Card key={index} className="overflow-hidden bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow">
                  <div className="p-6 md:p-8">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl font-semibold mb-2 text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mt-6">
                      <div>
                        <p className="text-xl font-bold text-primary">{service.price}</p>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                      <Button onClick={handleBookSession} className="bg-primary hover:bg-primary/90 text-primary-foreground">Book Now</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-6">Not sure which service is right for you?</p>
              <Link to="/contact">
                <Button variant="outline" className="border-primary text-primary hover:bg-secondary">
                  Contact Us for a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
