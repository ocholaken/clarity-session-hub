import { CalendarDays, Users, Clock, MessageSquare, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAppointments, useMessages, useProfiles, useServices } from "@/hooks/useAdminData";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AdminDashboard = () => {
  const { data: appointments = [] } = useAppointments();
  const { data: profiles = [] } = useProfiles();
  const { data: messages = [] } = useMessages();
  const { data: services = [] } = useServices();

  const now = new Date();
  const upcoming = appointments
    .filter((a) => new Date(a.scheduled_at) >= now && a.status !== "cancelled")
    .sort((a, b) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at));

  const priceById = new Map(services.map((s) => [s.id, Number(s.price)]));
  const revenue = appointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + (priceById.get(a.service_id ?? "") ?? 0), 0);

  const weekly = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - i));
    const count = appointments.filter((a) => {
      const d = new Date(a.scheduled_at);
      return d.toDateString() === day.toDateString();
    }).length;
    return { name: dayLabels[day.getDay()], appointments: count };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Live overview of your counseling practice.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total appointments" value={appointments.length} icon={CalendarDays} />
        <StatCard label="Upcoming sessions" value={upcoming.length} icon={Clock} tone="accent" />
        <StatCard label="Registered users" value={profiles.length} icon={Users} tone="secondary" />
        <StatCard label="New messages" value={messages.filter((m) => !m.is_read).length} icon={MessageSquare} tone="accent" />
        <StatCard
          label="Revenue (completed)"
          value={`KSh ${revenue.toLocaleString()}`}
          icon={Wallet}
          tone="secondary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appointments this week</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.18}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium">{a.client_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(a.scheduled_at).toLocaleString()}
                    {a.counselor_name ? ` · ${a.counselor_name}` : ""}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming sessions yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
