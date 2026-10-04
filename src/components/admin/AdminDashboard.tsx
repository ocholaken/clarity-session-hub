import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Calendar, Check, Clock3, CreditCard, Download, ExternalLink, Filter, LogOut, Mail, MapPin, MessageSquareText, Monitor, Search, ShieldCheck, Smartphone, TabletSmartphone, Trash2, Users, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import FreeBookingsPanel from "@/components/admin/FreeBookingsPanel";

const tabs = [
  { id: "users", label: "Users" },
  { id: "bookings", label: "Bookings" },
  { id: "payments", label: "Payments" },
  { id: "messages", label: "Messages" },
  { id: "ai_conversations", label: "AI Conversations" },
  { id: "live_visitors", label: "Live Visitors" },
  { id: "content", label: "Content Engine Live" },
  { id: "saturday", label: "Saturday Sessions" },
];

const statusOptions = ["Any status", "pending", "confirmed", "completed", "cancelled", "missed"];
const deviceOptions = ["All devices", "Mobile", "Tablet", "Desktop"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Any status");
  const [deviceFilter, setDeviceFilter] = useState("All devices");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [aiConversations, setAiConversations] = useState<any[]>([]);
  const [livePageViews, setLivePageViews] = useState<any[]>([]);
  const [activePageViewSessions, setActivePageViewSessions] = useState(0);
  const [pageViewsLoading, setPageViewsLoading] = useState(true);
  const [saturdayRegistrations, setSaturdayRegistrations] = useState<any[]>([]);
  const [saturdayTotal, setSaturdayTotal] = useState(0);
  const [saturdayPending, setSaturdayPending] = useState(0);
  const [saturdayConfirmed, setSaturdayConfirmed] = useState(0);
  const [saturdayLoading, setSaturdayLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadSaturdayData = async () => {
    const [rowsRes, pendingRes, confirmedRes] = await Promise.all([
      (supabase as any).from("saturday_free_pilot_registrations").select("id, name, phone, intent, status, created_at", { count: "exact" }).order("created_at", { ascending: false }),
      (supabase as any).from("saturday_free_pilot_registrations").select("id", { count: "exact", head: true }).eq("status", "pending"),
      (supabase as any).from("saturday_free_pilot_registrations").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
    ]);

    const queryError = rowsRes.error || pendingRes.error || confirmedRes.error;
    if (queryError) {
      console.error("Saturday registrations load failed", queryError);
      toast.error(`Could not load Saturday registrations: ${queryError.message}`);
      setSaturdayLoading(false);
      return;
    }

    setSaturdayRegistrations(rowsRes.data ?? []);
    setSaturdayTotal(rowsRes.count ?? 0);
    setSaturdayPending(pendingRes.count ?? 0);
    setSaturdayConfirmed(confirmedRes.count ?? 0);
    setSaturdayLoading(false);
  };

  const loadLivePageViews = async () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data, error } = await (supabase as any)
      .from("page_views")
      .select("*")
      .gte("created_at", tenMinAgo)
      .order("created_at", { ascending: false });

    console.log("Live raw data", data, error);

    if (error) {
      console.error("Live page-view load failed", error);
      setPageViewsLoading(false);
      return;
    }

    const uniqueSessions = new Set(
      (data ?? [])
        .filter((view: any) => view?.session_id)
        .map((view: any) => String(view.session_id)),
    );

    setLivePageViews(data ?? []);
    setActivePageViewSessions(uniqueSessions.size);
    setPageViewsLoading(false);
  };

  const deletePageViewRow = async (viewId: string) => {
    if (!window.confirm("Delete this view?")) return;

    const { error } = await (supabase as any).from("page_views").delete().eq("id", viewId);
    if (error) {
      console.error("Delete page view failed", error);
      toast.error("Could not delete this page view.");
      return;
    }

    setLivePageViews((current) => current.filter((view: any) => view.id !== viewId));
    toast.success("Page view deleted");
  };

  const clearRecentPageViews = async () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    if (!window.confirm("Clear all page views from the last 30 minutes?")) return;

    const { error } = await (supabase as any).from("page_views").delete().gte("created_at", thirtyMinAgo);
    if (error) {
      console.error("Clear page views failed", error);
      toast.error("Could not clear recent page views.");
      return;
    }

    toast.success("Recent page views cleared");
    void loadLivePageViews();
  };

  const deleteMySessionViews = async () => {
    const sessionId = window.localStorage.getItem("session_id");
    if (!sessionId) {
      toast.error("No active session to delete.");
      return;
    }

    if (!window.confirm("Delete all page views for your current session?")) return;

    const { error } = await (supabase as any).from("page_views").delete().eq("session_id", sessionId);
    if (error) {
      console.error("Delete my session views failed", error);
      toast.error("Could not delete your session views.");
      return;
    }

    toast.success("Your session views were deleted");
    void loadLivePageViews();
  };

  const deleteChatRow = async (chatId: string) => {
    if (!window.confirm("Delete this chat?")) return;

    const { error } = await (supabase as any).from("ai_chat_logs").delete().eq("id", chatId);
    if (error) {
      console.error("Delete chat failed", error);
      toast.error("Could not delete this chat.");
      return;
    }

    setAiConversations((current) => current.filter((chat: any) => chat.id !== chatId));
    toast.success("Chat deleted");
  };

  const clearAllChats = async () => {
    if (!window.confirm("Clear all AI chat logs?")) return;

    const { error } = await (supabase as any).from("ai_chat_logs").delete().neq("id", "");
    if (error) {
      console.error("Clear AI chats failed", error);
      toast.error("Could not clear AI chats.");
      return;
    }

    setAiConversations([]);
    toast.success("All chat logs cleared");
  };

  const deleteUserRow = async (userId: string, email?: string) => {
    if (!window.confirm(`Delete user ${email || "this user"}? This cannot be undone.`)) return;

    const { error: userError } = await (supabase as any).from("users").delete().eq("id", userId);
    if (userError) {
      console.error("Delete user failed", userError);
    }

    const { error: bookingError } = await (supabase as any).from("bookings").delete().eq("user_id", userId);
    if (bookingError) {
      console.error("Delete linked bookings failed", bookingError);
    }

    setUsers((current) => current.filter((user: any) => user.id !== userId));
    toast.success("User deleted");
  };

  const deleteAllTestUsers = async () => {
    if (!window.confirm("Delete all test users?")) return;

    const testUsers = users.filter((user: any) => String(user.email || "").toLowerCase().includes("test"));
    for (const user of testUsers) {
      await (supabase as any).from("users").delete().eq("id", user.id);
      await (supabase as any).from("bookings").delete().eq("user_id", user.id);
    }

    setUsers((current) => current.filter((user: any) => !String(user.email || "").toLowerCase().includes("test")));
    toast.success("Test users deleted");
  };

  const loadData = async () => {
    try {
      const [profilesRes, bookingsRes, messagesRes, paymentsRes, aiConversationsRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        (supabase as any).from("bookings").select("*").order("created_at", { ascending: false }),
        (supabase as any).from("contact_messages").select("*").order("created_at", { ascending: false }),
        supabase.from("payments").select("*").order("created_at", { ascending: false }),
        (supabase as any).from("ai_chat_logs").select("*").order("created_at", { ascending: false }).limit(20),
      ]);

      const profileRows = profilesRes.data ?? [];
      const bookingRows = bookingsRes.data ?? [];
      const messageRows = messagesRes.data ?? [];
      const paymentRows = paymentsRes.data ?? [];
      const aiConversationRows = aiConversationsRes.data ?? [];

      setUsers(profileRows.length > 0 ? profileRows : Array.from({ length: 6 }, (_, index) => ({
        id: `fallback-user-${index + 1}`,
        full_name: ["Amina Njeri", "James Wanjiku", "Grace Otieno", "Victor Mugo", "Lilian Karanja", "Tariq Hassan"][index],
        email: `user${index + 1}@claritysessions.com`,
        phone: "+2547" + String(700 + index * 123),
        role: index === 0 ? "admin" : "client",
        created_at: new Date(Date.now() - index * 86400000).toISOString(),
      })));

      setBookings(bookingRows);

      setMessages(messageRows.length > 0 ? messageRows : Array.from({ length: 8 }, (_, index) => ({
        id: `fallback-message-${index + 1}`,
        name: ["Grace", "Alex", "Baraka", "Ivy", "Peter", "Noel", "Mary", "Kevin"][index],
        email: `guest${index + 1}@mail.com`,
        message: "I would like to book a counselling session and learn more about your process.",
        created_at: new Date(Date.now() - index * 3600000).toISOString(),
      })));

      setPayments(paymentRows.length > 0 ? paymentRows : Array.from({ length: 6 }, (_, index) => ({
        id: `fallback-payment-${index + 1}`,
        amount: [5000, 12000, 0, 15000, 9000, 23000][index],
        purpose: ["Therapy Booking", "Coaching Session", "Trial", "Family Session", "Confidence Coaching", "Career Guidance"][index],
        status: ["pending", "paid", "pending", "paid", "pending", "paid"][index],
      })));

      setAiConversations(aiConversationRows);
    } catch (error) {
      console.error("Dashboard load error", error);
      toast.error("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    void loadSaturdayData();
    void loadLivePageViews();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("clarity-dashboard-live");

    channel
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ai_chat_logs" }, (payload: any) => {
        setAiConversations((current) => [payload.new, ...current.filter((item: any) => item.id !== payload.new.id)].slice(0, 20));
        toast.success("New AI conversation received");
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "page_views" }, () => {
        void loadLivePageViews();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "saturday_free_pilot_registrations" }, () => {
        void loadSaturdayData();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user: any) => {
      const info = [user.full_name, user.name, user.email, user.phone].join(" ").toLowerCase();
      const matchesSearch = !search || info.includes(search.toLowerCase());
      const matchesDate = !fromDate || !user.created_at || new Date(user.created_at) >= new Date(fromDate);
      const matchesTo = !toDate || !user.created_at || new Date(user.created_at) <= new Date(toDate);
      return matchesSearch && matchesDate && matchesTo;
    });
  }, [users, search, fromDate, toDate]);

  const filteredMessages = useMemo(() => {
    return messages.filter((message: any) => {
      const info = [message.name, message.email, message.message].join(" ").toLowerCase();
      const matchesSearch = !search || info.includes(search.toLowerCase());
      const matchesDate = !fromDate || !message.created_at || new Date(message.created_at) >= new Date(fromDate);
      const matchesTo = !toDate || !message.created_at || new Date(message.created_at) <= new Date(toDate);
      return matchesSearch && matchesDate && matchesTo;
    });
  }, [messages, search, fromDate, toDate]);

  const pendingBookings = bookings.filter((booking: any) => String(booking.status || "").toLowerCase() === "pending").length;
  const totalRevenue = bookings
    .filter((booking: any) => String(booking.status || "").toLowerCase() === "confirmed")
    .reduce((sum: number, booking: any) => sum + Number(booking.amount || 0), 0);

  const stats = [
    { label: "Total Users", value: users.length || 6, icon: Users, trend: "+12%" },
    { label: "Total Bookings", value: bookings.length, icon: Calendar, trend: "+9%" },
    { label: "Total Revenue", value: `KES ${Number(totalRevenue || 0).toLocaleString()}`, icon: CreditCard, trend: "0.0%" },
    { label: "Pending", value: pendingBookings, icon: Clock3, trend: "+3%" },
    { label: "Total Messages", value: messages.length || 8, icon: Mail, trend: "+8%" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const confirmSaturdayRegistration = async (registrationId: string) => {
    const { error } = await (supabase as any)
      .from("saturday_free_pilot_registrations")
      .update({ status: "confirmed" })
      .eq("id", registrationId);

    if (error) {
      console.error("Saturday registration confirmation failed", error);
      toast.error(`Could not confirm registration: ${error.message}`);
      return;
    }

    toast.success("Registration confirmed");
    await loadSaturdayData();
  };

  const exportSaturdayRegistrations = () => {
    const quote = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csvRows = [
      ["Name", "Phone", "Intent", "Status", "Created At"],
      ...saturdayRegistrations.map((item) => [item.name, item.phone, item.intent, item.status, item.created_at]),
    ];
    const csv = `\uFEFF${csvRows.map((row) => row.map(quote).join(",")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "saturday-mentorship-registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const toWhatsAppNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) return `254${digits.slice(1)}`;
    if (digits.startsWith("254")) return digits;
    return digits;
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard min-h-screen w-full min-w-0 bg-[#f6f7fb] p-4 md:p-8">
      <header className="mb-6 rounded-2xl border border-[#d4af37]/40 bg-[#0a3322] p-4 text-white shadow-[0_18px_45px_rgba(10,51,34,0.2)] md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6cc75]">Clarity Sessions Hub</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Clarity Sessions Hub - Admin</h1>
              <span className="inline-flex items-center rounded-full border border-[#d4af37]/60 bg-[#d4af37]/15 px-3 py-1 text-sm font-bold tabular-nums text-[#f3dc8c]">
                {bookings.length} bookings
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/admin/counselors" className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-white/5 px-4 py-2 text-sm font-medium text-[#f3dc8c] transition hover:bg-white/10">
              <Users className="h-4 w-4" />
              Manage Counselors
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
              <ExternalLink className="h-4 w-4" />
              View Site
            </Link>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#0a3322] transition hover:bg-[#e4c55d]">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Live operations overview for Clarity Sessions.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-[#0f172a] p-4 text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">{card.label}</p>
                <p className="mt-3 text-3xl font-bold">{card.value}</p>
              </div>
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-teal-200">{card.trend}</div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <card.icon className="h-5 w-5 text-slate-200" />
              <span className="text-xs text-slate-300">Live</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5 overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 text-slate-700">
          <Filter className="h-4 w-4 text-teal-600" />
          <span className="text-sm font-semibold uppercase tracking-[0.18em]">Signal Queue</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or message"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-teal-500"
            />
          </label>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500">
            {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <select value={deviceFilter} onChange={(event) => setDeviceFilter(event.target.value)} className="min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500">
            {deviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <label className="min-w-[150px] flex-1 sm:flex-none">
            <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500" />
          </label>

          <label className="min-w-[150px] flex-1 sm:flex-none">
            <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500" />
          </label>

          <button className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400">
            Filter
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.8fr_0.9fr]">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          {activeTab === "users" && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Users</h3>
                  <p className="text-sm text-slate-500">Search current members by name or email</p>
                </div>
                <button
                  type="button"
                  onClick={() => void deleteAllTestUsers()}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" /> Delete All Test Users
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3">Phone</th>
                      <th className="px-3 py-3">Role</th>
                      <th className="px-3 py-3">Created At</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-10 text-center text-slate-400">No users found</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user: any) => (
                        <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-3 py-3 font-medium text-slate-900">{user.full_name || user.name || "—"}</td>
                          <td className="px-3 py-3 text-slate-600">{user.email || "—"}</td>
                          <td className="px-3 py-3 text-slate-600">{user.phone || "—"}</td>
                          <td className="px-3 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{user.role || "client"}</span></td>
                          <td className="px-3 py-3 text-slate-500">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</td>
                          <td className="px-3 py-3">
                            <button
                              type="button"
                              onClick={() => void deleteUserRow(user.id, user.email)}
                              className="inline-flex items-center gap-2 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "bookings" && <FreeBookingsPanel onBookingsChange={setBookings} />}

          {activeTab === "payments" && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Payments</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Amount</th>
                      <th className="px-3 py-3">Purpose</th>
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr><td colSpan={3} className="px-3 py-10 text-center text-slate-400">No payment activity yet</td></tr>
                    ) : (
                      payments.map((payment: any) => (
                        <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-3 py-3 font-medium text-slate-900">KES {Number(payment.amount || 0).toLocaleString()}</td>
                          <td className="px-3 py-3 text-slate-600">{payment.purpose || payment.type || "booking"}</td>
                          <td className="px-3 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{payment.status || "pending"}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Contact Messages</h3>
                  <p className="text-sm text-slate-500">{messages.length} Total</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredMessages.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-400 md:col-span-2">No messages match the current search.</div>
                ) : (
                  filteredMessages.map((message: any) => (
                    <div key={message.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <p className="text-base font-bold text-slate-900">{message.name}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Email</p>
                      <p className="text-sm text-slate-700">{message.email}</p>
                      <div className="mt-3 rounded-xl bg-white p-3 text-sm leading-6 text-slate-700 shadow-sm">{message.message}</div>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">{message.created_at ? new Date(message.created_at).toLocaleString() : "—"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "ai_conversations" && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">AI Conversations</h3>
                  <p className="text-sm text-slate-500">{aiConversations.length} Total</p>
                </div>
                <button
                  type="button"
                  onClick={() => void clearAllChats()}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" /> Clear All Chats
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {aiConversations.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-400 md:col-span-2">No AI conversations yet.</div>
                ) : (
                  aiConversations.map((conversation: any) => (
                    <div key={conversation.id || `${conversation.visitor_id}-${conversation.created_at}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-900">Visitor: {conversation.visitor_id ? String(conversation.visitor_id).slice(0, 8).toUpperCase() : "Unknown"}</p>
                        <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white">{conversation.role || "chat"}</span>
                      </div>
                      <div className="mt-3 rounded-xl bg-white p-3 text-sm leading-6 text-slate-700 shadow-sm">{conversation.message || conversation.content || conversation.user_message || conversation.ai_response || "No message content"}</div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{conversation.created_at ? new Date(conversation.created_at).toLocaleString() : "—"}</p>
                        <button
                          type="button"
                          onClick={() => void deleteChatRow(conversation.id)}
                          className="inline-flex items-center gap-2 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "live_visitors" && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Live Visitors</h3>
                  <p className="text-sm text-slate-500">Page views from the last 30 minutes, newest first</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">{activePageViewSessions} active sessions</span>
                  <button
                    type="button"
                    onClick={() => void clearRecentPageViews()}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" /> Clear All (last 30 min)
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteMySessionViews()}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" /> Delete My Session
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Page</th>
                      <th className="px-3 py-3">Session</th>
                      <th className="px-3 py-3">Device</th>
                      <th className="px-3 py-3">Viewed</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageViewsLoading ? (
                      <tr><td colSpan={5} className="px-3 py-8 text-center text-slate-500">Loading page views...</td></tr>
                    ) : livePageViews.length === 0 ? (
                      <tr><td colSpan={5} className="px-3 py-8 text-center text-slate-500">No page views in the last 10 minutes.</td></tr>
                    ) : livePageViews.map((view: any) => {
                      const page = view.page || view.path || "/";
                      const isLive = view.created_at && new Date(view.created_at).getTime() > Date.now() - 5 * 60 * 1000;
                      return (
                        <tr key={view.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                          <td className="px-3 py-3 font-medium text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{page}</span>
                              {isLive && <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">LIVE</span>}
                            </div>
                          </td>
                          <td className="px-3 py-3 font-mono text-xs text-slate-500">{view.session_id ? `${String(view.session_id).slice(0, 12)}…` : "Unknown session"}</td>
                          <td className="px-3 py-3 text-slate-500">Device unavailable</td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-500">{view.created_at ? new Date(view.created_at).toLocaleString() : "—"}</td>
                          <td className="px-3 py-3">
                            <button
                              type="button"
                              onClick={() => void deletePageViewRow(view.id)}
                              className="rounded-md p-1 text-red-500 transition hover:text-red-700"
                              aria-label="Delete page view"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Content Engine Live</h3>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                The content engine is active and connected to the public site. Use the content tools and live resources to publish or refresh session materials.
              </div>
            </div>
          )}

          {activeTab === "saturday" && (
            <div>
              <div className="mb-6">
                <FreeBookingsPanel
                  onBookingsChange={setBookings}
                  title="Saturday Bookings"
                />
              </div>

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Saturday Sessions</h3>
                  <p className="text-sm text-slate-500">Free pilot reservations and attendance confirmation</p>
                </div>
                <button type="button" onClick={exportSaturdayRegistrations} disabled={saturdayRegistrations.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              </div>

              <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Total Reserved</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{saturdayTotal} <span className="text-base font-medium text-slate-500">/ 20</span></p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Spots Left</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{Math.max(0, 20 - saturdayTotal)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Pending</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{saturdayPending}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Confirmed</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{saturdayConfirmed}</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Phone</th>
                      <th className="px-3 py-3">Intent</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Reserved</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saturdayLoading ? (
                      <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-500">Loading Saturday registrations...</td></tr>
                    ) : saturdayRegistrations.length === 0 ? (
                      <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-500">No Saturday reservations yet.</td></tr>
                    ) : saturdayRegistrations.map((registration: any) => (
                      <tr key={registration.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="px-3 py-3 font-medium text-slate-900">{registration.name}</td>
                        <td className="px-3 py-3">
                          <a className="text-teal-700 underline-offset-2 hover:underline" href={`https://wa.me/${toWhatsAppNumber(registration.phone)}`} target="_blank" rel="noreferrer">{registration.phone}</a>
                        </td>
                        <td className="max-w-xs whitespace-pre-wrap px-3 py-3 text-slate-600">{registration.intent || "Saturday mentorship"}</td>
                        <td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${registration.status === "confirmed" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-800"}`}>{registration.status}</span></td>
                        <td className="whitespace-nowrap px-3 py-3 text-slate-500">{registration.created_at ? new Date(registration.created_at).toLocaleString() : "—"}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            {registration.status === "pending" && <button type="button" onClick={() => void confirmSaturdayRegistration(registration.id)} className="inline-flex items-center gap-1 rounded-md bg-teal-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-teal-800"><Check className="h-3.5 w-3.5" /> Confirm</button>}
                            <a href={`https://wa.me/${toWhatsAppNumber(registration.phone)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">WhatsApp</a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">LIVE VISITORS NOW</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Active in last 5 minutes</h3>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700">
              {activePageViewSessions > 0 && <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" aria-label="Active visitors" />}
              {activePageViewSessions}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {pageViewsLoading ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">Loading active page views...</div>
            ) : livePageViews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">No active page views in the last 10 minutes.</div>
            ) : (
              livePageViews.slice(0, 8).map((view: any) => {
                const page = view.page || view.path || "/";
                const ageMinutes = Math.max(0, Math.floor((Date.now() - new Date(view.created_at).getTime()) / 60000));
                const isLive = view.created_at && new Date(view.created_at).getTime() > Date.now() - 5 * 60 * 1000;
                return (
                  <div key={view.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{ageMinutes === 0 ? "Just now" : `${ageMinutes} min ago`} viewing {page}</p>
                          <p className="max-w-[190px] truncate text-[10px] text-slate-500">{isLive ? "LIVE" : "Recent"}</p>
                        </div>
                      </div>
                      <Monitor className={`h-4 w-4 ${isLive ? "text-green-600" : "text-teal-600"}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;