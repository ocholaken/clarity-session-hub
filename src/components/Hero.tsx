
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-gradient py-20 md:py-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Begin Your Journey to <span className="text-lavender-500">Mental Wellness</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Professional counseling services to help you navigate life's challenges with clarity and confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button className="text-lg py-6 px-8 bg-lavender-500 hover:bg-lavender-600 text-white">
                  Book a Session
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="text-lg py-6 px-8 border-lavender-400 text-lavender-600 hover:bg-lavender-100">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-soft-green flex items-center justify-center text-sm font-medium">JD</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-soft-blue flex items-center justify-center text-sm font-medium">KM</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-soft-pink flex items-center justify-center text-sm font-medium">TS</div>
              </div>
              <p className="text-gray-600">
                <span className="font-semibold">300+</span> happy clients this month
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl animate-fade-up animation-delay-200 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-lavender-400/20 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
              alt="Person receiving counseling" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
