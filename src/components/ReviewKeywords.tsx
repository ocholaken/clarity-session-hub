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
    <div ref={ref} className="relative mb-12 overflow-hidden py-5">
      <div className={`review-keywords-marquee flex w-max gap-4 px-4 sm:gap-6 md:gap-8 ${visible ? "opacity-100" : "opacity-0"}`}>
        {[...keywords, ...keywords].map((word, i) => (
          <div key={`${word}-${i}`} style={{ animationDelay: `${(i % keywords.length) * 0.2}s` }} className="review-keyword group flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-[#E9D5FF] bg-white shadow-sm transition-all duration-300 hover:scale-110 hover:border-[#6D28D9] hover:shadow-lg sm:h-24 sm:w-24 md:h-28 md:w-28">
            <span className="px-2 text-center text-xs font-bold text-[#6D28D9] sm:text-sm md:text-base">{word}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewKeywords;
