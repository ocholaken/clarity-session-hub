
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center">
                <span className="text-white font-bold">CS</span>
              </div>
              <span className="text-xl font-bold text-lavender-700">Clarity Sessions</span>
            </Link>
            <p className="text-gray-600 mb-6">
              Professional counseling services to help you navigate life's challenges with clarity and confidence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-lavender-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-lavender-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-lavender-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-lavender-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-lavender-600">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-lavender-600">Services</Link>
              </li>
              <li>
                <Link to="/counselors" className="text-gray-600 hover:text-lavender-600">Our Counselors</Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 hover:text-lavender-600">Resources</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-lavender-600">FAQ</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/individual" className="text-gray-600 hover:text-lavender-600">Individual Counseling</Link>
              </li>
              <li>
                <Link to="/services/couples" className="text-gray-600 hover:text-lavender-600">Couples Therapy</Link>
              </li>
              <li>
                <Link to="/services/family" className="text-gray-600 hover:text-lavender-600">Family Counseling</Link>
              </li>
              <li>
                <Link to="/services/career" className="text-gray-600 hover:text-lavender-600">Career Guidance</Link>
              </li>
              <li>
                <Link to="/services/wellness" className="text-gray-600 hover:text-lavender-600">Wellness Coaching</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-lavender-500" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-lavender-500" />
                <span className="text-gray-600">contact@claritysessions.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-lavender-500 mt-1" />
                <span className="text-gray-600">
                  1234 Mindful Way, <br />
                  Serenity City, SC 98765
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Clarity Sessions. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link to="/privacy" className="hover:text-lavender-600">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-lavender-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
