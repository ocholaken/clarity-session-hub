import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const number = "254740381046";
  const message = "Hi Kenna, I need support from Clarity Sessions Hub";
  const waLink = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-24 right-6 z-[9999] group">
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-[ping_2.5s_ease-out_infinite]" aria-hidden="true" />
      <div className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_24px_rgba(37,211,102,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#128C7E] animate-[float_3s_ease-in-out_infinite]">
        <MessageCircle className="h-8 w-8 text-white" strokeWidth={2.3} aria-hidden="true" />
      </div>
      <div className="absolute right-[72px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-gray-900 px-4 py-2 text-[13px] text-white opacity-0 transition-all group-hover:opacity-100">
        Chat with Kenna on WhatsApp
      </div>
      <style>{`@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }`}</style>
    </a>
  );
}
