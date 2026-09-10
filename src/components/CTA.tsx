
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-16 bg-lavender-100">
      <div className="container">
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Take the first step towards mental wellness today. Book your initial consultation and experience the benefits of professional counseling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto min-h-[52px] text-base sm:text-lg px-8 bg-lavender-500 hover:bg-lavender-600 text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                    Book a Session
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto min-h-[52px] text-base sm:text-lg px-8 border-lavender-400 text-lavender-600 hover:bg-lavender-100 transition-transform duration-200 active:scale-[0.98]">
                    Contact Us
                  </Button>
                </Link>
              </div>

            </div>
            <div className="relative h-64 lg:h-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-lavender-400/20 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" 
                alt="Serene landscape" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
