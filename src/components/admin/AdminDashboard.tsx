import { useCallback, useEffect, useState } from "react";
import { CalendarDays, CreditCard, Users, Clock3, ExternalLink, LogOut, Mail, MailOpen, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import UsersTable from "@/components/admin/UsersTable";
import BookingsTable from "@/components/admin/BookingsTable";
import PaymentsTable from "@/components/admin/PaymentsTable";
import { contentPool, type ContentPiece } from "@/data/contentPool";
import { getAllLikes, type LikeState } from "@/hooks/useLikes";

type Profile = { id: string; full_name: string | null; email: string | null; phone: string | null; role: string; created_at: string };
type Booking = { id: string; user_id: string | null; counselor_name: string | null; booking_date: string; booking_time: string; status: string; created_at: string };
type Payment = { id: string; user_id: string | null; amount: number; reference: string | null; provider_reference: string | null; status: string; created_at: string };
type ContactMessage = { id: string; name: string; email: string; subject: string; message: string; date: string; isRead: boolean };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAdminAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentHour, setContentHour] = useState(new Date().getHours());
  const [contentNow, setContentNow] = useState<{ hour: number; nextIn: number } | null>(null);
  const [contentEdit, setContentEdit] = useState<ContentPiece | null>(null);
  const [likeStats, setLikeStats] = useState<Record<string, LikeState>>({});

  const loadData = useCallback(async () => {
    const [profilesResult, bookingsResult, paymentsResult, messagesResult] = await Promise.all([
      supabase.from("profiles").select("id,full_name,email,phone,role,created_at").order("created_at", { ascending: false }),
      supabase.from("bookings").select("id,user_id,counselor_name,booking_date,booking_time,status,created_at").order("created_at", { ascending: false }),
      supabase.from("payments").select("id,user_id,amount,reference,provider_reference,status,created_at").order("created_at", { ascending: false }),
      fetch("/api/messages"),
    ]);
    if (profilesResult.error) throw profilesResult.error;
    if (bookingsResult.error) throw bookingsResult.error;
    if (paymentsResult.error) throw paymentsResult.error;
    if (!messagesResult.ok) throw new Error("Could not load contact messages");
    const messagesData = await messagesResult.json() as ContactMessage[];
    setProfiles((profilesResult.data ?? []) as Profile[]);
    setBookings((bookingsResult.data ?? []) as Booking[]);
    setPayments((paymentsResult.data ?? []) as Payment[]);
    setMessages(messagesData);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
    const channel = supabase
      .channel("admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, loadData)
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [loadData]);

  useEffect(() => {
    fetch("/api/content/now").then((response) => response.json()).then((data) => setContentNow(data)).catch(() => undefined);
    const refreshLikeStats = () => setLikeStats(getAllLikes());
    refreshLikeStats();
    window.addEventListener("clarity-likes-updated", refreshLikeStats);
    return () => window.removeEventListener("clarity-likes-updated", refreshLikeStats);
  }, []);

  const revenue = payments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  const stats = [
    ["Total Users", profiles.length, Users],
    ["Total Bookings", bookings.length, CalendarDays],
    ["Total Revenue", `KES ${revenue.toLocaleString()}`, CreditCard],
    ["Pending", bookings.filter((booking) => booking.status === "pending").length, Clock3],
    ["Total Messages", messages.length, Mail],
  ] as const;

  const updateMessageReadState = async (message: ContactMessage) => {
    const response = await fetch(`/api/messages/${encodeURIComponent(message.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !message.isRead }),
    });
    if (response.ok) await loadData();
  };

  const deleteMessage = async (message: ContactMessage) => {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;
    const response = await fetch(`/api/messages/${encodeURIComponent(message.id)}`, { method: "DELETE" });
    if (response.ok) await loadData();
  };

  const selectedArticle = contentPool.find((piece) => piece.hourSlot === contentHour && piece.type === "article");
  const selectedGuide = contentPool.find((piece) => piece.hourSlot === contentHour && piece.type === "guide");
  const selectedLikes = selectedArticle ? likeStats[selectedArticle.id] : undefined;
  const selectedGuideLikes = selectedGuide ? likeStats[selectedGuide.id] : undefined;
  const forceRotate = () => {
    setContentHour(new Date().getHours());
    void fetch("/api/content/now", { cache: "no-store" }).then((response) => response.json()).then((data) => setContentNow(data));
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-base font-semibold leading-tight text-gray-900">Clarity Sessions</p>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-full px-4 py-2 text-sm">
              <Link to="/" target="_self" aria-label="View site">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
            </Button>
            <Button type="button" onClick={() => void handleLogout()} className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-black/80">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div><h2 className="text-2xl font-bold">Admin Dashboard</h2><p className="text-muted-foreground">Live operations overview for Clarity Sessions.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value, Icon]) => <Card key={label}><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p>{loading ? <Skeleton className="mt-2 h-8 w-24" /> : <p className="mt-1 text-2xl font-bold">{value}</p>}</div><Icon className="h-5 w-5 text-primary" /></CardContent></Card>)}
      </div>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap gap-1"><TabsTrigger value="users">Users</TabsTrigger><TabsTrigger value="bookings">Bookings</TabsTrigger><TabsTrigger value="payments">Payments</TabsTrigger><TabsTrigger value="messages" className="gap-2">Messages<span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{messages.length}</span></TabsTrigger><TabsTrigger value="content-engine" className="gap-2">Content Engine <span className="rounded-full bg-[#25D366]/15 px-2 py-0.5 text-xs text-[#15803D]">Live</span></TabsTrigger></TabsList>
        <TabsContent value="users"><UsersTable profiles={profiles} loading={loading} onChanged={loadData} /></TabsContent>
        <TabsContent value="bookings"><BookingsTable bookings={bookings} profiles={profiles} loading={loading} onChanged={loadData} /></TabsContent>
        <TabsContent value="payments"><PaymentsTable payments={payments} profiles={profiles} loading={loading} onChanged={loadData} /></TabsContent>
        <TabsContent value="messages">
          <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-primary text-primary-foreground"><tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Subject</th><th className="px-5 py-4">Message</th><th className="px-5 py-4">Date</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {messages.map((message) => <tr key={message.id} className={`align-top transition-colors hover:bg-secondary/50 ${message.isRead ? "" : "bg-accent/10"}`}><td className="px-5 py-4 font-semibold">{message.name}</td><td className="px-5 py-4 text-muted-foreground">{message.email}</td><td className="px-5 py-4 font-medium">{message.subject}</td><td className="max-w-[340px] whitespace-pre-line px-5 py-4 leading-6 text-muted-foreground">{message.message}</td><td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{new Date(message.date).toLocaleString()}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Button variant="outline" size="sm" onClick={() => void updateMessageReadState(message)}>{message.isRead ? <Mail className="mr-2 h-4 w-4" /> : <MailOpen className="mr-2 h-4 w-4" />}{message.isRead ? "Unread" : "Read"}</Button><Button variant="ghost" size="icon" onClick={() => void deleteMessage(message)} aria-label="Delete message"><Trash2 className="h-4 w-4 text-destructive" /></Button></div></td></tr>)}
                    {!loading && messages.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">No contact messages yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content-engine" className="space-y-5">
          <Card className="overflow-hidden rounded-2xl border-border bg-gradient-to-br from-primary to-[#4F46E5] text-primary-foreground shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#DEC96B]">Clarity Intelligence</p><h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Content Engine • Live</h3><p className="mt-2 max-w-2xl text-white/70">A 24-hour editorial system designed to meet attention where it is and move the day forward.</p></div><div className="flex flex-wrap gap-2"><Button onClick={forceRotate} className="bg-white text-primary hover:bg-white/90">Force Rotate Now</Button><Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">Schedule AI Generation</Button></div></div>
              <div className="mt-7 flex gap-2 overflow-x-auto pb-2">{Array.from({ length: 24 }, (_, hour) => { const article = contentPool.find((piece) => piece.hourSlot === hour && piece.type === "article"); const stats = article ? likeStats[article.id] : undefined; return <button key={hour} type="button" onClick={() => { setContentHour(hour); setContentEdit(article ?? null); }} className={`min-w-[70px] rounded-xl border px-3 py-3 text-left transition-all ${hour === contentHour ? "border-[#DEC96B] bg-white text-primary shadow-lg ring-2 ring-[#DEC96B]/50" : "border-white/15 bg-white/10 text-white/75 hover:bg-white/20"}`}><span className="block text-xs font-bold">{String(hour).padStart(2, "0")}:00</span><span className="mt-1 block text-[10px]">{hour === new Date().getHours() ? "LIVE" : "2 drops"}</span><span className="mt-1 block text-[10px] text-[#DEC96B]">{stats ? `${stats.likes} likes` : "No votes"}</span></button>; })}</div>
            </CardContent>
          </Card>
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><Card className="rounded-2xl border-border shadow-sm"><CardContent className="p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6F9085]">Selected hour</p><h3 className="mt-1 text-xl font-bold text-primary">{String(contentHour).padStart(2, "0")}:00 editorial slate</h3></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">{selectedArticle?.trendingScore ?? 0} engagement</span></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-border bg-secondary/40 p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Article</p><h4 className="mt-2 font-bold text-primary">{selectedArticle?.title}</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedArticle?.excerpt}</p><p className="mt-3 text-xs font-semibold text-primary">{selectedLikes ? `${selectedLikes.likes} likes · ${selectedLikes.dislikes} dislikes` : "No local votes yet"}</p></div><div className="rounded-2xl border border-border bg-accent/30 p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Guide</p><h4 className="mt-2 font-bold text-primary">{selectedGuide?.title}</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedGuide?.excerpt}</p><p className="mt-3 text-xs font-semibold text-primary">{selectedGuideLikes ? `${selectedGuideLikes.likes} likes · ${selectedGuideLikes.dislikes} dislikes` : "No local votes yet"}</p></div></div><div className="mt-5 flex items-center justify-between rounded-xl bg-primary/5 p-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Next content preview</p><p className="mt-1 font-semibold text-primary">{contentPool.find((piece) => piece.hourSlot === (contentHour + 1) % 24 && piece.type === "article")?.title}</p></div><Clock3 className="h-5 w-5 text-primary" /></div></CardContent></Card><Card className="rounded-2xl border-border shadow-sm"><CardContent className="p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6F9085]">Inline editor</p><h3 className="mt-1 text-xl font-bold text-primary">Tune this hour</h3>{contentEdit ? <div className="mt-5 space-y-4"><label className="block text-sm font-semibold text-foreground">Title<input value={contentEdit.title} onChange={(event) => setContentEdit({ ...contentEdit, title: event.target.value })} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 font-normal outline-none focus:border-primary" /></label><label className="block text-sm font-semibold text-foreground">Excerpt<textarea value={contentEdit.excerpt} onChange={(event) => setContentEdit({ ...contentEdit, excerpt: event.target.value })} className="mt-2 min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 font-normal outline-none focus:border-primary" /></label><Button className="w-full bg-primary" onClick={() => setContentEdit(null)}>Save editorial draft</Button></div> : <p className="mt-5 text-sm leading-6 text-muted-foreground">Select an hour from the timeline to edit its article draft.</p>}</CardContent></Card></div>
          {contentNow && <p className="text-xs text-muted-foreground">Live engine currently serving hour {contentNow.hour}. Next rotation in {Math.ceil(contentNow.nextIn / 60000)} minutes.</p>}
        </TabsContent>
      </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;