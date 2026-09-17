import { useEffect, useMemo, useState } from "react";
import { Bookmark, Brain, Check, Clock3, Copy, Crown, Flame, LockKeyhole, Share2, Shield, Sparkles, ThumbsDown, ThumbsUp, Zap } from "lucide-react";
import type { ContentPiece } from "@/data/contentPool";
import { useLikes } from "@/hooks/useLikes";

interface ContentResponse {
  currentArticle: (ContentPiece & { watermark?: string | null }) | null;
  currentGuide: (ContentPiece & { watermark?: string | null }) | null;
  nextIn: number;
  hour: number;
  isNewHour: boolean;
}

const cacheKey = (hour: number) => `clarity_hour_${hour}`;
const formatHour = (hour: number) => new Intl.DateTimeFormat("en", { hour: "numeric" }).format(new Date(2020, 0, 1, hour));
const formatCountdown = (milliseconds: number) => {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
};

const categoryIcons = { "Mental Clarity": Brain, Leadership: Crown, Focus: Zap, "Burnout Recovery": Shield };

const ContentCard = ({ piece, featured }: { piece: ContentResponse["currentArticle"]; featured?: boolean }) => {
  if (!piece) return null;
  const CategoryIcon = categoryIcons[piece.category];
  const { likes, dislikes, userAction, handleLike, handleDislike } = useLikes(piece.id);
  const [bookmarked, setBookmarked] = useState(() => typeof window !== "undefined" && window.localStorage.getItem(`clarity_bookmark_${piece.id}`) === "true");
  const [shared, setShared] = useState(false);
  const totalVotes = likes + dislikes;
  const helpfulPercent = totalVotes ? Math.round((likes / totalVotes) * 100) : 0;
  const buzz = (action: () => void) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
    action();
  };
  const share = async () => {
    const shareData = { title: piece.title, text: piece.excerpt, url: window.location.href };
    if (navigator.share) await navigator.share(shareData).catch(() => undefined);
    else { await navigator.clipboard?.writeText(window.location.href); setShared(true); window.setTimeout(() => setShared(false), 1800); }
  };
  const toggleBookmark = () => { const next = !bookmarked; setBookmarked(next); window.localStorage.setItem(`clarity_bookmark_${piece.id}`, String(next)); };
  return (
    <article className={`group relative overflow-hidden rounded-[24px] border border-white/30 bg-white/75 shadow-[0_12px_32px_rgba(109,40,217,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(109,40,217,0.24)] ${featured ? "min-h-[480px]" : "min-h-[390px]"}`}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/80 via-white/55 to-[#E7EFEC]/50" />
      <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-[#6D28D9] via-[#4F46E5] to-[#0EA5E9]">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/45 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-[0_8px_24px_rgba(17,24,39,0.22)] backdrop-blur-xl"><CategoryIcon className="h-10 w-10" strokeWidth={1.8} /></div></div>
        <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80"><span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />{piece.type === "article" ? "Featured Article" : "Guide of the Hour"}</span>
      </div>
      <div className="border-l-4 border-[#6D28D9] p-7">
        <div className="flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#6D28D9]"><span>{piece.category}</span><span className="inline-flex items-center gap-1 text-muted-foreground normal-case tracking-normal"><Clock3 className="h-3.5 w-3.5" />{piece.readTime}</span></div>
        <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-primary">{piece.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-500">{piece.excerpt}</p>
        <div className="mt-5 border-t border-primary/10 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => buzz(handleLike)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-all hover:shadow-[0_8px_24px_rgba(109,40,217,0.2)] ${userAction === "like" ? "scale-105 border-transparent bg-gradient-to-r from-[#6D28D9] to-[#4F46E5] text-white" : "border-primary/15 bg-white/60 text-primary"}`} aria-label="Like content"><ThumbsUp className="h-3.5 w-3.5" />{likes}</button>
          <button type="button" onClick={() => buzz(handleDislike)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-all hover:shadow-[0_8px_24px_rgba(17,24,39,0.18)] ${userAction === "dislike" ? "scale-105 border-gray-800 bg-gray-800 text-white" : "border-primary/15 bg-white/60 text-primary"}`} aria-label="Dislike content"><ThumbsDown className="h-3.5 w-3.5" />{dislikes}</button>
          <div className="ml-auto flex items-center gap-1"><button type="button" onClick={() => void share()} className="rounded-full border border-primary/15 bg-white/60 p-2 text-primary transition hover:shadow-[0_8px_24px_rgba(109,40,217,0.2)]" aria-label="Share content">{shared ? <Check className="h-4 w-4" /> : navigator.share ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button><button type="button" onClick={toggleBookmark} className={`rounded-full border border-primary/15 p-2 transition hover:shadow-[0_8px_24px_rgba(109,40,217,0.2)] ${bookmarked ? "bg-[#C9A227] text-[#382B08]" : "bg-white/60 text-primary"}`} aria-label="Bookmark content"><Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} /></button></div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs"><span className="font-medium text-primary">{userAction === "like" ? `Liked by you + ${Math.max(0, likes - 1)} others` : `${helpfulPercent}% found this helpful`}</span><span className="text-muted-foreground">{totalVotes} responses</span></div>
        <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-red-100"><span className="bg-[#25D366] transition-all duration-500" style={{ width: `${helpfulPercent}%` }} /><span className="bg-[#FCA5A5]" style={{ width: `${100 - helpfulPercent}%` }} /></div>
        </div>
      </div>
    </article>
  );
};

const HourlyContentEngine = () => {
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [activeHour, setActiveHour] = useState(new Date().getHours());
  const [refreshKey, setRefreshKey] = useState(0);

  const loadContent = async (hour = new Date().getHours()) => {
    const cached = localStorage.getItem(cacheKey(hour));
    if (cached) {
      try { setContent(JSON.parse(cached) as ContentResponse); } catch { localStorage.removeItem(cacheKey(hour)); }
    }
    const response = await fetch("/api/content/now", { cache: "no-store" });
    if (!response.ok) return;
    const fresh = await response.json() as ContentResponse;
    localStorage.setItem(cacheKey(fresh.hour), JSON.stringify(fresh));
    setContent(fresh);
    setActiveHour(fresh.hour);
    setRemaining(fresh.nextIn);
    document.title = `Clarity Sessions • ${formatHour(fresh.hour)} ${fresh.currentArticle?.category ?? "Clarity"}`;
  };

  useEffect(() => { void loadContent(); }, [refreshKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      setRemaining(nextHour.getTime() - now.getTime());
      if (now.getHours() !== activeHour) {
        setActiveHour(now.getHours());
        setRefreshKey((value) => value + 1);
      }
    }, 1000);
    const prefetch = window.setInterval(() => {
      const now = new Date();
      if (now.getMinutes() >= 55) void fetch("/api/content/now", { cache: "no-store" });
    }, 60000);
    return () => { window.clearInterval(timer); window.clearInterval(prefetch); };
  }, [activeHour]);

  const progress = useMemo(() => {
    const now = new Date();
    return ((now.getMinutes() * 60 + now.getSeconds()) / 3600) * 100;
  }, [remaining]);

  if (!content) return <div className="h-[520px] animate-pulse rounded-3xl bg-secondary/60" aria-label="Loading hourly content" />;

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F8F7F3] via-white to-[#E7EFEC] px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#6D28D9] via-[#4F46E5] to-[#C9A227]"><span className="block h-full bg-white/70 transition-all duration-1000" style={{ width: `${progress}%` }} /></div>
      <div className="relative mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Sparkles className="h-3.5 w-3.5" />Clarity Intelligence</div><h2 className="max-w-2xl text-3xl font-bold tracking-tight text-primary sm:text-4xl">The hour, made more useful.</h2><p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">Fresh thinking and practical guidance, selected for the moment you are in.</p></div><div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#6F9085]/30 bg-white/80 px-3 py-2 text-xs font-bold text-primary shadow-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-[#25D366]" />LIVE NOW • Hour {content.hour} • Fresh</div></div>
      <div className="relative grid gap-5 lg:grid-cols-[1.3fr_0.85fr]"><div key={`${content.hour}-article`} className="hourly-content-enter"><ContentCard piece={content.currentArticle} featured /></div><div key={`${content.hour}-guide`} className="hourly-content-enter [animation-delay:120ms]"><ContentCard piece={content.currentGuide} /></div></div>
      <div className="relative mt-6 grid gap-4 lg:grid-cols-[1fr_auto]"><div className="rounded-2xl border border-primary/10 bg-white/65 p-4 shadow-sm"><div className="flex items-center gap-2 text-sm font-bold text-primary"><Flame className="h-4 w-4 text-[#C9A227]" />Why this now?</div><p className="mt-2 text-sm leading-6 text-muted-foreground">At {formatHour(content.hour)}, attention and energy are shaped by the day’s accumulated decisions. This drop gives you one clear protocol before the next transition.</p></div><div className="flex items-center justify-between gap-4 rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-lg"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">Next drop</p><p className="mt-1 text-xl font-bold">{formatCountdown(remaining)}</p></div><LockKeyhole className="h-5 w-5 text-[#DEC96B]" /></div></div>
    </section>
  );
};

export default HourlyContentEngine;
