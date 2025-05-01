
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center">
            <span className="text-white font-bold">CS</span>
          </div>
          <span className="text-xl font-bold text-lavender-700">Clarity Sessions</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-lavender-600 transition-colors">Home</Link>
          <Link to="/services" className="text-gray-600 hover:text-lavender-600 transition-colors">Services</Link>
          <Link to="/counselors" className="text-gray-600 hover:text-lavender-600 transition-colors">Counselors</Link>
          <Link to="/resources" className="text-gray-600 hover:text-lavender-600 transition-colors">Resources</Link>
          <Link to="/contact" className="text-gray-600 hover:text-lavender-600 transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" className="border-lavender-400 text-lavender-600 hover:bg-lavender-100">
              Log In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-lavender-500 hover:bg-lavender-600 text-white">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="py-2 px-4 hover:bg-lavender-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="py-2 px-4 hover:bg-lavender-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/counselors" 
              className="py-2 px-4 hover:bg-lavender-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Counselors
            </Link>
            <Link 
              to="/resources" 
              className="py-2 px-4 hover:bg-lavender-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link 
              to="/contact" 
              className="py-2 px-4 hover:bg-lavender-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex gap-2 mt-2">
              <Link to="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-lavender-400 text-lavender-600 hover:bg-lavender-100">
                  Log In
                </Button>
              </Link>
              <Link to="/register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-lavender-500 hover:bg-lavender-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
