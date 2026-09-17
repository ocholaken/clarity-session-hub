import { useState } from "react";
import { Search, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type Profile = { id: string; full_name: string | null; email: string | null; phone: string | null; role: string; created_at: string };

export default function UsersTable({ profiles, loading, onChanged }: { profiles: Profile[]; loading: boolean; onChanged: () => Promise<void> }) {
  const [search, setSearch] = useState("");
  const filtered = profiles.filter((profile) => `${profile.full_name ?? ""} ${profile.email ?? ""} ${profile.phone ?? ""}`.toLowerCase().includes(search.toLowerCase()));

  const makeAdmin = async (profile: Profile) => {
    const { error } = await supabase.from("profiles").update({ role: "admin" }).eq("id", profile.id);
    if (error) toast.error(error.message); else { toast.success("User promoted to admin"); await onChanged(); }
  };

  const deleteUser = async (profile: Profile) => {
    if (!window.confirm(`Delete ${profile.email ?? "this user"}?`)) return;
    const { error } = await supabase.from("profiles").delete().eq("id", profile.id);
    if (error) toast.error(error.message); else { toast.success("User deleted"); await onChanged(); }
  };

  return <Card><CardContent className="space-y-4 p-4">
    <div className="relative max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
    <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Role</TableHead><TableHead>Created At</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {loading ? Array.from({ length: 4 }, (_, index) => <TableRow key={index}><TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell></TableRow>) : filtered.map((profile) => <TableRow key={profile.id}><TableCell className="font-medium">{profile.full_name ?? "Unnamed user"}</TableCell><TableCell>{profile.email ?? "No email"}</TableCell><TableCell>{profile.phone ?? "-"}</TableCell><TableCell><Badge variant={profile.role === "admin" ? "default" : "secondary"}>{profile.role || "client"}</Badge></TableCell><TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2">{profile.role !== "admin" && <Button size="sm" variant="outline" onClick={() => void makeAdmin(profile)}><ShieldCheck className="mr-1 h-4 w-4" />Admin</Button>}<Button size="icon" variant="ghost" onClick={() => void deleteUser(profile)} aria-label="Delete user"><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell></TableRow>)}
      {!loading && filtered.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No users found.</TableCell></TableRow>}
    </TableBody></Table>
  </CardContent></Card>;
}