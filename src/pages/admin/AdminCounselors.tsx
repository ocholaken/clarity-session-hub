import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, UserRound, UserRoundX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type Gender = "Male" | "Female";
type GenderFilter = "All" | Gender;
type Counselor = {
  id: string;
  full_name: string;
  gender: string | null;
  specialty: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
};

const emptyForm = { full_name: "", gender: "Female" as Gender, specialty: "", phone: "", email: "" };

const AdminCounselors = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("All");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadCounselors = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("counselors").select("*").order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) {
        toast.error("Could not load counselors. Check the Supabase migration and admin access.");
      } else {
        setCounselors(data ?? []);
      }
      setLoading(false);
    };

    void loadCounselors();
    return () => {
      mounted = false;
    };
  }, [reloadKey]);

  const filteredCounselors = counselors.filter((counselor) =>
    genderFilter === "All" || counselor.gender === genderFilter,
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (counselor: Counselor) => {
    setEditingId(counselor.id);
    setForm({
      full_name: counselor.full_name,
      gender: counselor.gender === "Male" ? "Male" : "Female",
      specialty: counselor.specialty ?? "",
      phone: counselor.phone ?? "",
      email: counselor.email ?? "",
    });
    setFormOpen(true);
  };

  const saveCounselor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const values = {
      full_name: form.full_name.trim(),
      gender: form.gender,
      specialty: form.specialty.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
    };
    const result = editingId
      ? await supabase.from("counselors").update(values).eq("id", editingId)
      : await supabase.from("counselors").insert(values);
    setSaving(false);

    if (result.error) {
      toast.error("Could not save the counselor.");
      return;
    }

    toast.success(editingId ? "Counselor updated" : "Counselor added");
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setReloadKey((current) => current + 1);
  };

  const setCounselorActive = async (counselor: Counselor) => {
    const { error } = await supabase
      .from("counselors")
      .update({ is_active: !counselor.is_active })
      .eq("id", counselor.id);
    if (error) {
      toast.error("Could not update counselor status.");
      return;
    }
    toast.success(counselor.is_active ? "Counselor deactivated" : "Counselor activated");
    setReloadKey((current) => current + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage Counselors</h2>
          <p className="text-muted-foreground">Add and manage counselor profiles.</p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Counselor
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Filter counselors by gender">
        {(["All", "Male", "Female"] as const).map((filter) => (
          <Button
            key={filter}
            type="button"
            variant={genderFilter === filter ? "default" : "outline"}
            onClick={() => setGenderFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Counselors ({filteredCounselors.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCounselors.map((counselor) => (
                <TableRow key={counselor.id}>
                  <TableCell className="font-medium">{counselor.full_name}</TableCell>
                  <TableCell>{counselor.gender ?? "Not set"}</TableCell>
                  <TableCell>{counselor.specialty || "-"}</TableCell>
                  <TableCell>{counselor.phone || "-"}</TableCell>
                  <TableCell>{counselor.email || "-"}</TableCell>
                  <TableCell>
                    <span className={counselor.is_active ? "text-emerald-600" : "text-muted-foreground"}>
                      {counselor.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => openEditForm(counselor)}>
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => void setCounselorActive(counselor)}
                      >
                        {counselor.is_active ? <UserRoundX className="mr-1 h-3.5 w-3.5" /> : <UserRound className="mr-1 h-3.5 w-3.5" />}
                        {counselor.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredCounselors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No counselors match this filter.
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Loading counselors...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditingId(null);
            setForm(emptyForm);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Counselor" : "Add Counselor"}</DialogTitle>
            <DialogDescription>Enter the counselor profile details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveCounselor} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="counselor-name">Name</Label>
              <Input
                id="counselor-name"
                required
                value={form.full_name}
                onChange={(event) => setForm({ ...form, full_name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="counselor-gender">Gender</Label>
              <select
                id="counselor-gender"
                required
                value={form.gender}
                onChange={(event) => setForm({ ...form, gender: event.target.value as Gender })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="counselor-specialty">Specialty</Label>
              <Input
                id="counselor-specialty"
                value={form.specialty}
                onChange={(event) => setForm({ ...form, specialty: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="counselor-phone">Phone</Label>
              <Input
                id="counselor-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="counselor-email">Email</Label>
              <Input
                id="counselor-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Counselor"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCounselors;