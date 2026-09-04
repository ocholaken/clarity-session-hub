import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "@/hooks/useAdminData";

const styles: Record<AppointmentStatus, string> = {
  pending: "bg-accent/15 text-accent border-accent/30",
  confirmed: "bg-primary/10 text-primary border-primary/30",
  completed: "bg-secondary/20 text-foreground border-secondary/40",
  cancelled: "bg-muted text-muted-foreground border-border",
  missed: "bg-destructive/10 text-destructive border-destructive/30",
};

const StatusBadge = ({ status }: { status: AppointmentStatus }) => (
  <Badge variant="outline" className={`capitalize ${styles[status]}`}>
    {status}
  </Badge>
);

export default StatusBadge;
