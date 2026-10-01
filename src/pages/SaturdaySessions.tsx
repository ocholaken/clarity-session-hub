import React, { useState } from "react";
import { CalendarDays, Clock3, MapPin, Video, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SaturdaySessions = () => {
  const [form, setForm] = useState({ name: "", email: "", focus: "Personal Growth" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success(`Thanks ${form.name || "friend"}! Your Saturday session registration is saved.`);
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <header className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Clarity Sessions</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Saturday Personal Development Sessions</h1>
          </div>
          <Link to="/" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">Back to site</Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200">
              <CalendarDays className="h-3.5 w-3.5" /> Weekly Live Session
            </span>
            <h2 className="mt-5 text-4xl font-bold leading-tight">Build clarity, confidence, and momentum every Saturday.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Join a practical session designed to help you reset your mindset, identify what matters, and build a personal roadmap for the week ahead.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Clock3 className="h-5 w-5 text-teal-300" />
                <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-slate-300">Time</p>
                <p className="mt-2 text-base font-semibold">9:00 AM</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <MapPin className="h-5 w-5 text-teal-300" />
                <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-slate-300">Venue</p>
                <p className="mt-2 text-base font-semibold">Live online</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Video className="h-5 w-5 text-teal-300" />
                <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-slate-300">Format</p>
                <p className="mt-2 text-base font-semibold">Jitsi Live</p>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">This week’s focus</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {[
                "Reflection and emotional clarity",
                "Reframing limiting thoughts",
                "Building a sustainable weekly system",
                "Action planning and accountability",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href="https://meet.jit.si/clarity-saturday" target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400">
              Join Live Jitsi
              <ArrowRight className="h-4 w-4" />
            </a>
          </aside>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Reserve your spot</h3>
            <p className="mt-2 text-sm text-slate-500">Register for the upcoming Saturday session.</p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="Your full name" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Session focus</label>
                <select value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500">
                  <option>Personal Growth</option>
                  <option>Stress Relief</option>
                  <option>Career Clarity</option>
                  <option>Confidence Building</option>
                </select>
              </div>
              <button type="submit" className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">Register for Saturday session</button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">What to expect</h3>
            <div className="mt-5 space-y-4">
              {[
                "A guided 45-minute live session focused on emotional clarity and personal reset.",
                "Reflective prompts, grounding exercises, and practical life strategies.",
                "Live Q&A and optional follow-up resources for deeper support.",
              ].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">0{index + 1}</div>
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaturdaySessions;
