import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/admin/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { AppointmentStatus, useAppointments, useServices } from "@/hooks/useAdminData";

const statuses: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "missed"];

const AdminAppointments = () => {
  const { data: appointments = [], isLoading } = useAppointments();
  const { data: services = [] } = useServices();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const serviceName = (id: string | null) => services.find((s) => s.id === id)?.name ?? "—";

  const filtered = appointments.filter((a) => {
    const matchesSearch = `${a.client_name} ${a.client_email} ${a.client_phone ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = filter === "all" || a.status === filter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) return toast.error("Could not update the booking");
    toast.success(`Booking marked ${status}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) return toast.error("Could not delete the booking");
    toast.success("Booking deleted");
    queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Appointments</h2>
        <p className="text-muted-foreground">Approve, reschedule and track every booking.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name, email or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date &amp; time</TableHead>
                <TableHead>Counselor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <p className="font-medium">{a.client_name}</p>
                    <p className="text-xs text-muted-foreground">{a.client_email}</p>
                    {a.client_phone && (
                      <p className="text-xs text-muted-foreground">{a.client_phone}</p>
                    )}
                  </TableCell>
                  <TableCell>{serviceName(a.service_id)}</TableCell>
                  <TableCell>{new Date(a.scheduled_at).toLocaleString()}</TableCell>
                  <TableCell>{a.counselor_name ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v as AppointmentStatus)}>
                        <SelectTrigger className="w-36 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => remove(a.id)} aria-label="Delete booking">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAppointments;
