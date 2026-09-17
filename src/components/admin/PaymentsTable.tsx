import { Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type Payment = { id: string; user_id: string | null; amount: number; reference: string | null; provider_reference: string | null; status: string; created_at: string };
type Profile = { id: string; full_name: string | null; email: string | null };

export default function PaymentsTable({ payments, profiles, loading, onChanged }: { payments: Payment[]; profiles: Profile[]; loading: boolean; onChanged: () => Promise<void> }) {
  const verify = async (payment: Payment) => { const { error } = await supabase.from("payments").update({ status: "successful" }).eq("id", payment.id); if (error) toast.error(error.message); else { toast.success("Payment verified"); await onChanged(); } };
  const exportCsv = () => { const rows = [["User", "Amount", "Transaction code", "Status", "Created"], ...payments.map((payment) => { const profile = profiles.find((item) => item.id === payment.user_id); return [profile?.email ?? payment.user_id ?? "", String(payment.amount), payment.provider_reference ?? payment.reference ?? "", payment.status, payment.created_at]; })]; const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = "payments.csv"; link.click(); URL.revokeObjectURL(url); };
  return <Card><CardContent className="space-y-4 p-4"><div className="flex justify-end"><Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />Export CSV</Button></div><Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Amount</TableHead><TableHead>Transaction code</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
    {loading ? Array.from({ length: 4 }, (_, index) => <TableRow key={index}><TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell></TableRow>) : payments.map((payment) => { const profile = profiles.find((item) => item.id === payment.user_id); return <TableRow key={payment.id}><TableCell>{profile?.email ?? payment.user_id ?? "Unknown user"}</TableCell><TableCell>KES {Number(payment.amount).toLocaleString()}</TableCell><TableCell className="font-mono text-xs">{payment.provider_reference ?? payment.reference ?? "-"}</TableCell><TableCell><Badge variant={payment.status === "successful" || payment.status === "completed" ? "default" : payment.status === "failed" ? "destructive" : "secondary"}>{payment.status}</Badge></TableCell><TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell><TableCell className="text-right">{payment.status !== "successful" && payment.status !== "completed" && <Button size="sm" onClick={() => void verify(payment)}><CheckCircle2 className="mr-1 h-4 w-4" />Verify</Button>}</TableCell></TableRow>; })}
    {!loading && payments.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No payments found.</TableCell></TableRow>}
  </TableBody></Table></CardContent></Card>;
}