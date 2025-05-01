
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="container max-w-3xl text-center py-16 px-4">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
            <div className="w-20 h-20 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-lavender-600">404</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Page Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex justify-center gap-4 flex-col sm:flex-row">
              <Link to="/">
                <Button className="bg-lavender-500 hover:bg-lavender-600 text-white px-6 py-6 text-lg w-full">
                  Return to Home
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-lavender-400 text-lavender-600 hover:bg-lavender-100 px-6 py-6 text-lg w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
