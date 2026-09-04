import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "primary" | "secondary" | "accent";
}

const toneClasses: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary-foreground",
  accent: "bg-accent/15 text-accent",
};

const StatCard = ({ label, value, icon: Icon, hint, tone = "primary" }: StatCardProps) => (
  <Card className="border-border">
    <CardContent className="p-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${toneClasses[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
