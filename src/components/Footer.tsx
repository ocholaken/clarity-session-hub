
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#174A4A] text-white pt-16 pb-8 border-t border-[#6F9085]/40">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold">CS</span>
              </div>
              <span className="text-xl font-bold text-white">Clarity Sessions</span>
            </Link>
            <p className="text-white/75 mb-6">
              Professional counseling services to help you navigate life's challenges with clarity and confidence.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#103838] text-[#DEC96B] transition-transform duration-200 hover:bg-[#6F9085] hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#103838] text-[#DEC96B] transition-transform duration-200 hover:bg-[#6F9085] hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#103838] text-[#DEC96B] transition-transform duration-200 hover:bg-[#6F9085] hover:scale-110"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary">Services</Link>
              </li>
              <li>
                <Link to="/counselors" className="text-muted-foreground hover:text-primary">Our Counselors</Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary">Resources</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
              </li>
              <li>
                <Link to="/booking" className="text-muted-foreground hover:text-primary">Book a Session</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-white/75 hover:text-[#DEC96B]">Individual Counseling</Link>
              </li>
              <li>
                <Link to="/services" className="text-white/75 hover:text-[#DEC96B]">Couples Therapy</Link>
              </li>
              <li>
                <Link to="/services" className="text-white/75 hover:text-[#DEC96B]">Family Counseling</Link>
              </li>
              <li>
                <Link to="/services" className="text-white/75 hover:text-[#DEC96B]">Career Guidance</Link>
              </li>
              <li>
                <Link to="/services" className="text-white/75 hover:text-[#DEC96B]">Wellness Coaching</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#DEC96B]" />
                <span className="text-white/75">+254 740 381 046</span>
                <a
                  href="https://wa.me/254740381046?text=Hi%20Kenna%2C%20I%20need%20support%20from%20Clarity%20Sessions%20Hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#103838] text-[#DEC96B] transition-transform duration-200 hover:bg-[#6F9085] hover:scale-110"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#DEC96B]" />
                <span className="text-white/75">contact@claritysessions.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#DEC96B] mt-1" />
                <span className="text-white/75">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-[#DEC96B]" />
                <span className="text-white/75">Mon – Sat, 8:00 AM – 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 mt-6 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Clarity Sessions. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link to="/privacy" className="hover:text-[#DEC96B]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#DEC96B]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
