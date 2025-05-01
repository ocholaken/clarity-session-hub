
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Counselors from "@/components/Counselors";
import Testimonials from "@/components/Testimonials";
import ResourcesPreview from "@/components/ResourcesPreview";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Counselors />
        <Testimonials />
        <ResourcesPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
