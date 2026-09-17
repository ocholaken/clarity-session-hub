import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type Booking = { id: string; user_id: string | null; counselor_name: string | null; booking_date: string; booking_time: string; status: string; created_at: string };
type Profile = { id: string; full_name: string | null; email: string | null };

export default function BookingsTable({ bookings, profiles, loading, onChanged }: { bookings: Booking[]; profiles: Profile[]; loading: boolean; onChanged: () => Promise<void> }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const visibleBookings = statusFilter === "all" ? bookings : bookings.filter((booking) => booking.status === statusFilter);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success(`Booking ${status}`); await onChanged(); }
  };
  return <Card><CardContent className="space-y-4 p-0"><div className="flex justify-end px-4 pt-4"><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="Filter bookings by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option><option value="completed">Completed</option></select></div><Table><TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Counsellor</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
    {loading ? Array.from({ length: 4 }, (_, index) => <TableRow key={index}><TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell></TableRow>) : visibleBookings.map((booking) => { const profile = profiles.find((item) => item.id === booking.user_id); return <TableRow key={booking.id}><TableCell><p className="font-medium">{profile?.full_name ?? "Unknown client"}</p><p className="text-xs text-muted-foreground">{profile?.email ?? booking.user_id ?? "-"}</p></TableCell><TableCell>{booking.counselor_name ?? "General counsellor"}</TableCell><TableCell>{new Date(`${booking.booking_date}T00:00:00`).toLocaleDateString()} at {booking.booking_time}</TableCell><TableCell><Badge variant={booking.status === "cancelled" ? "destructive" : booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge></TableCell><TableCell className="text-right"><div className="flex justify-end gap-2">{booking.status === "pending" && <Button size="sm" onClick={() => void updateStatus(booking.id, "confirmed")}>Confirm</Button>}{booking.status !== "cancelled" && <Button size="sm" variant="outline" onClick={() => void updateStatus(booking.id, "cancelled")}>Cancel</Button>}</div></TableCell></TableRow>; })}
    {!loading && visibleBookings.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No bookings found.</TableCell></TableRow>}
  </TableBody></Table></CardContent></Card>;
}