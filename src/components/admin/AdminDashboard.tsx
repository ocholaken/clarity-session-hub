import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, CreditCard, Clock, Mail, Search } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ users: 0, bookings: 0, revenue: 0, pending: 0, messages: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: bookingsData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      const { data: payments } = await supabase.from('payments').select('amount');
      const { data: msgs } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });

      setUsers(profiles || []);
      setBookings(bookingsData || []);
      setMessages(msgs || []);
      const rev = payments?.reduce((s: any, p: any) => s + Number(p.amount || 0), 0) || 0;
      setStats({
        users: profiles?.length || 0,
        bookings: bookingsData?.length || 0,
        revenue: rev,
        pending: bookingsData?.filter((b: any) => b.status === 'pending').length || 0,
        messages: msgs?.length || 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

  const filteredUsers = users.filter((u: any) =>
    (u.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Total Bookings", value: stats.bookings, icon: Calendar },
    { label: "Total Revenue", value: `KES ${stats.revenue.toLocaleString()}`, icon: CreditCard },
    { label: "Pending", value: stats.pending, icon: Clock },
    { label: "Total Messages", value: stats.messages, icon: Mail },
  ];

  return (
    <div className="p-6 md:p-8 bg-[#fcfcf9] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Live operations overview for Clarity Sessions.</p>
      </div>

      {/* Stats Cards - EXACT like your photo */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">{c.label}</p>
                <p className="text-2xl font-bold mt-3 text-gray-900">{c.value}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg"><c.icon className="w-4 h-4 text-gray-600" /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6 text-sm font-medium justify-center">
        {[
          { id: "users", label: "Users" },
          { id: "bookings", label: "Bookings" },
          { id: "payments", label: "Payments" },
          { id: "messages", label: `Messages ${stats.messages}` },
          { id: "content", label: "Content Engine Live", live: true },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 border-b-2 flex items-center gap-2 ${activeTab === tab.id? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"}`}
          >
            {tab.label} {tab.live && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">Live</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        {activeTab === "users" && (
          <>
            <div className="mb-5 relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                placeholder="Search users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 border-b">
                  <tr><th className="text-left py-3 font-medium">Name</th><th className="text-left py-3 font-medium">Email</th><th className="text-left py-3 font-medium">Phone</th><th className="text-left py-3 font-medium">Role</th><th className="text-left py-3 font-medium">Created At</th></tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium">{u.full_name || "—"}</td>
                      <td className="py-3 text-gray-600">{u.email}</td>
                      <td className="py-3 text-gray-600">{u.phone || "—"}</td>
                      <td className="py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{u.role || "user"}</span></td>
                      <td className="py-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <p className="text-center py-10 text-gray-400">No users found</p>}
            </div>
          </>
        )}

        {activeTab === "bookings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500 border-b"><tr><th className="text-left py-3">Client</th><th className="text-left py-3">Service</th><th className="text-left py-3">Status</th><th className="text-left py-3">Date</th></tr></thead>
              <tbody>
                {bookings.map((b: any) => (
                  <tr key={b.id} className="border-b"><td className="py-3">{b.client_name || b.email || b.user_email}</td><td className="py-3">{b.service || b.package || "—"}</td><td className="py-3"><span className={`px-2 py-1 rounded-full text-xs ${b.status === 'pending'? 'bg-orange-100 text-orange-700':'bg-green-100 text-green-700'}`}>{b.status}</span></td><td className="py-3 text-gray-500">{new Date(b.created_at).toLocaleDateString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {messages.map((m: any) => (
              <div key={m.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex justify-between"><p className="font-medium text-sm">{m.name} — <span className="text-gray-500 font-normal">{m.email}</span></p><span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleString()}</span></div>
                <p className="text-sm text-gray-700 mt-2">{m.message}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-center py-10 text-gray-400">No messages</p>}
          </div>
        )}

        {activeTab === "payments" && <p className="text-center py-10 text-gray-500">Total Revenue: <span className="font-bold">KES {stats.revenue.toLocaleString()}</span> — Payments from Supabase payments table</p>}
        {activeTab === "content" && <p className="text-center py-10 text-gray-500">Content Engine is <span className="text-green-600 font-bold">Live</span> — Connected to Supabase</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;