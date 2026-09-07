import { useEffect, useRef, useState } from "react";

const keywords = [
  "Trust",
  "Quality",
  "Professional",
  "Reliable",
  "Experience",
  "Support",
];

const ReviewKeywords = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-12"
    >
      {keywords.map((word, i) => (
        <div
          key={word}
          style={{ transitionDelay: `${i * 110}ms` }}
          className={`group flex items-center justify-center rounded-full border border-lavender-200 bg-white/80 backdrop-blur shadow-md
            h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28
            transition-all duration-700 ease-out will-change-transform
            hover:shadow-xl hover:-translate-y-1 hover:border-lavender-400
            ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-4"}`}
        >
          <span className="text-center px-2 text-xs sm:text-sm md:text-base font-semibold text-lavender-700 transition-transform duration-300 group-hover:scale-110">
            {word}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ReviewKeywords;
