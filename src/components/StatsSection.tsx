import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Clients supported" },
  { value: 1000, suffix: "+", label: "Sessions delivered" },
  { value: 95, suffix: "%", label: "Client satisfaction" },
  { value: 12, suffix: "", label: "Licensed counselors" },
];

const Counter = ({ value, suffix, start }: { value: number; suffix: string; start: boolean }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const duration = 1600;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value]);

  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ transitionDelay: `${i * 90}ms` }}
              className={`transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-3xl md:text-5xl font-bold text-lavender-600 tabular-nums">
                <Counter value={s.value} suffix={s.suffix} start={inView} />
              </p>
              <p className="mt-2 text-sm md:text-base text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
