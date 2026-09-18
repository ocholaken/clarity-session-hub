import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, CreditCard, Clock, Mail, Search, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

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
      try {
        // Use safe queries — don't crash if table missing
        const [profilesRes, bookingsRes, msgsRes, paymentsRes] = await Promise.all([
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('bookings').select('*').order('created_at', { ascending: false }),
          supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
          supabase.from('payments').select('amount').then(r => r).catch(() => ({ data: [] }))
        ]);

        const profiles = profilesRes.data || [];
        const bookingsData = bookingsRes.data || [];
        const msgs = msgsRes.data || [];
        const payments = (paymentsRes as any).data || [];

        // If profiles is empty, BUILD users list from bookings + messages so you SEE names/emails
        let combinedUsers = [...profiles];
        if (combinedUsers.length === 0 && bookingsData.length > 0) {
          const map = new Map();
          bookingsData.forEach((b: any) => {
            const email = b.email || b.user_email || b.client_email;
            if (email &&!map.has(email)) {
              map.set(email, {
                id: b.id,
                full_name: b.client_name || b.full_name || b.name || "Booking Client",
                email: email,
                phone: b.phone || b.client_phone || "—",
                role: "client",
                created_at: b.created_at
              });
            }
          });
          combinedUsers = Array.from(map.values());
        }

        setUsers(combinedUsers);
        setBookings(bookingsData);
        setMessages(msgs);
        const rev = payments.reduce((s: any, p: any) => s + Number(p.amount || 0), 0);
        setStats({
          users: combinedUsers.length,
          bookings: bookingsData.length,
          revenue: rev,
          pending: bookingsData.filter((b: any) => b.status === 'pending').length,
          messages: msgs.length,
        });
      } catch (e) {
        console.error("Dashboard load error", e);
      } finally {
        setLoading(false);
      }
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
      {/* Header with View Site Button - EXACT like you want */}
      <div className="flex justify-between items-center mb-6 bg-white border rounded-xl p-4">
        <div>
          <h1 className="text-xl font-bold">Clarity Sessions</h1>
          <p className="text-xs text-gray-500">Admin Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white">
            <ExternalLink className="w-4 h-4" /> View Site
          </Link>
          <button onClick={() => { localStorage.clear(); window.location.href="/"; }} className="bg-black text-white px-4 py-2 rounded-full text-sm">Logout</button>
        </div>
      </div>

      <div className="mb-6"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-sm text-gray-500">Live operations overview for Clarity Sessions.</p></div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between"><div><p className="text-xs text-gray-500">{c.label}</p><p className="text-2xl font-bold mt-3">{c.value}</p></div><c.icon className="w-5 h-5 text-gray-500" /></div>
          </div>
        ))}
      </div>

      <div className="flex gap-6 border-b mb-6 text-sm font-medium justify-center">
        {[
          { id: "users", label: "Users" },
          { id: "bookings", label: "Bookings" },
          { id: "payments", label: "Payments" },
          { id: "messages", label: `Messages ${stats.messages}` },
          { id: "content", label: "Content Engine Live" },
        ].map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-3 border-b-2 ${activeTab===tab.id?"border-black text-black":"border-transparent text-gray-500"}`}>{tab.label}</button>))}
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-5">
        {activeTab === "users" && (
          <>
            <div className="mb-5 relative max-w-sm"><Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" /><input placeholder="Search users by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" /></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm"><thead className="text-xs text-gray-500 border-b"><tr><th className="text-left py-3">Name</th><th className="text-left py-3">Email</th><th className="text-left py-3">Phone</th><th className="text-left py-3">Role</th><th className="text-left py-3">Created At</th></tr></thead>
                <tbody>{filteredUsers.length===0? <tr><td colSpan={5} className="text-center py-10 text-gray-400">No users found — check Supabase profiles or bookings table has data</td></tr> : filteredUsers.map((u: any) => (<tr key={u.id} className="border-b hover:bg-gray-50"><td className="py-3 font-medium text-black">{u.full_name || u.name || "—"}</td><td className="py-3">{u.email}</td><td className="py-3">{u.phone || "—"}</td><td className="py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{u.role || "user"}</span></td><td className="py-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td></tr>))}</tbody>
              </table>
            </div>
          </>
        )}
        {activeTab === "messages" && (<div className="grid md:grid-cols-2 gap-4">{messages.map((m: any) => (<div key={m.id} className="border rounded-lg p-4"><p className="font-bold text-sm">{m.name}</p><p className="text-xs text-gray-500">{m.email}</p><div className="bg-gray-50 p-3 rounded mt-2 text-sm">{m.message}</div><p className="text-[10px] text-gray-400 mt-2">{new Date(m.created_at).toLocaleString()}</p></div>))}{messages.length===0 && <p className="text-gray-400">No messages yet</p>}</div>)}
        {activeTab === "bookings" && <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="text-left py-2">Client</th><th className="text-left">Service</th><th className="text-left">Status</th></tr></thead><tbody>{bookings.map((b: any) => (<tr key={b.id} className="border-b"><td className="py-2">{b.client_name || b.email}</td><td className="py-2">{b.service || b.package}</td><td className="py-2">{b.status}</td></tr>))}</tbody></table></div>}
      </div>

      {/* FOOTER ALWAYS - MESSAGE SITE */}
      <div className="bg-white border rounded-xl mt-8"><div className="p-4 border-b font-bold flex justify-between"><span>Contact Messages — Read Name & Email & Message</span><span className="bg-black text-white text-xs px-3 py-1 rounded-full">{stats.messages} Total</span></div><div className="p-4 grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">{messages.map((m: any) => (<div key={m.id} className="border rounded-xl p-4"><p className="font-bold">{m.name}</p><p className="text-xs text-gray-500">Email: {m.email}</p><p className="text-sm mt-2 bg-gray-50 p-2 rounded">{m.message}</p></div>))}</div></div>
    </div>
  );
};
export default AdminDashboard;