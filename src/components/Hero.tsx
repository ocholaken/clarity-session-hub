import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ShieldCheck, Lock, Clock } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-width background photo, softly blurred */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBackground}
          alt="A counselor and client in a calm, supportive session"
          className="h-full w-full object-cover object-center scale-105 blur-[3px]"
          width={1920}
          height={1088}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/75 via-gray-900/60 to-gray-900/75" />
      </div>

      <div className="container py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Confidential counseling in Kenya
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            Clarity Session Hub — talk to a professional counselor,{" "}
            <span className="text-lavender-200">on your schedule</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-100/90 max-w-2xl">
            For individuals, couples, families and students who want a safe, private space to work
            through stress, relationships, grief or career decisions. Book a licensed counselor
            online in under two minutes and get a confirmed time that fits your day.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="min-h-[52px] text-base px-8 bg-lavender-500 hover:bg-lavender-600 text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white"
            >
              <Link to="/book">Book a Session</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-[52px] text-base px-8 border-white/70 bg-white/10 text-white hover:bg-white hover:text-lavender-700 backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <Link to="/services">Learn More</Link>
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            {[
              { icon: Calendar, label: "Same-week appointments" },
              { icon: Lock, label: "Private & confidential" },
              { icon: Clock, label: "Sessions from 50 minutes" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg bg-white/10 backdrop-blur px-4 py-3"
              >
                <Icon className="h-5 w-5 text-[#7A9E7E] shrink-0" aria-hidden="true" />
                <dt className="text-sm font-medium text-gray-100">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Hero;
