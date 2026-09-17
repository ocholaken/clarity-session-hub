import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi, I am Clarity AI 💜 How are you feeling today? I'm here to support you.",
};

const ClarityAIChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Kenneth");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.full_name;
      if (typeof name === "string" && name.trim()) setUserName(name.trim().split(" ")[0]);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const saveMessage = async (userId: string | null, message: string, isAi: boolean) => {
    if (!userId) return;
    await supabase.from("ai_chat_history").insert({ user_id: userId, message, is_ai: isAi });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setInput("");
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: message };
    const history = [...messages, userMessage];
    setMessages(history);
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id ?? null;
    await saveMessage(userId, message, false);

    try {
      const { data, error } = await supabase.functions.invoke("clarity-ai-chat", {
        body: {
          messages: history.map(({ role, content }) => ({ role, content })),
        },
      });
      if (error) throw error;
      const reply = data?.reply;
      if (typeof reply !== "string" || !reply.trim()) throw new Error("Clarity AI returned no reply");
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
      await saveMessage(userId, reply, true);
    } catch (error) {
      console.error("Clarity AI request failed", error);
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: "I am unable to respond right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#174A4A]/25 p-4 backdrop-blur-sm sm:p-6" role="presentation" onClick={() => setIsOpen(false)}>
          <section className="animate-fade-up flex h-[min(75vh,760px)] max-h-[calc(100dvh-2rem)] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl border border-[#D2E1DC] bg-[#FEFEFE] shadow-2xl" aria-label="Clarity AI chat" onClick={(event) => event.stopPropagation()}>
            <header className="flex items-start justify-between gap-3 bg-[linear-gradient(135deg,#174A4A_0%,#5D8175_100%)] px-4 py-4 text-white sm:px-5 sm:py-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold tracking-wide ring-1 ring-white/30 sm:h-11 sm:w-11">CS</div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold leading-5 sm:text-base">Clarity AI - Your Wellness Companion</h2>
                  <p className="mt-0.5 text-sm text-white/75">Here to listen, no judgment</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white" aria-label="Close chat"><X className="h-5 w-5" /></button>
            </header>
            <div className="chat-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto bg-[#FEFEFE] p-4 sm:p-6" style={{ backgroundImage: "radial-gradient(#E7EFEC 0.8px, transparent 0.8px)", backgroundSize: "18px 18px" }} aria-live="polite">
              {messages.map((item) => {
                const isAssistant = item.role === "assistant";
                return (
                  <div key={item.id} className={`flex items-end gap-2.5 ${isAssistant ? "" : "justify-end"}`}>
                    {isAssistant && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">CS</div>}
                    <div className={`max-w-[calc(100%-3rem)] whitespace-pre-wrap break-words antialiased rounded-2xl px-4 py-3 text-[15px] leading-7 sm:max-w-[82%] ${isAssistant ? "motion-safe:animate-fade-up border-l-4 border-primary bg-white text-foreground shadow-sm" : "rounded-br-md bg-primary text-primary-foreground shadow-md"}`}>{item.content}</div>
                    {!isAssistant && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">{userName.charAt(0).toUpperCase()}</div>}
                  </div>
                );
              })}
              {loading && (
                <div className="flex items-end gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">CS</div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border-l-4 border-primary bg-white px-4 py-4 shadow-sm" aria-label="Clarity AI is typing">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[#D2E1DC] bg-white p-3 sm:gap-3 sm:p-5">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={`Share what's on your mind, ${userName}...`} aria-label="Message Clarity AI" className="min-w-0 flex-1 rounded-full border border-[#B7CDC5] bg-[#F8F7F3] px-4 py-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:px-5" disabled={loading} />
              <button type="submit" disabled={loading || !input.trim()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#103838] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message"><Send className="h-5 w-5" /></button>
            </form>
          </section>
        </div>
      )}
      {!isOpen && <button type="button" onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground shadow-2xl transition-transform hover:scale-105" aria-expanded={isOpen} aria-label="Talk to Clarity AI">
        <MessageCircle className="h-5 w-5" /><span className="hidden sm:inline">Talk to Clarity AI</span>
      </button>}
    </>
  );
};

export default ClarityAIChatbot;