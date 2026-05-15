import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type Complaint = {
  id: string; category: string; issue: string; location: string;
  description: string; status: string; anonymous: boolean; created_at: string;
  user_id: string;
};
type Profile = { full_name: string; email: string; role: string; department: string | null };

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Campus Problem Solver" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [reporters, setReporters] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name,email,role,department")
        .eq("id", user.id)
        .maybeSingle();
      const prof = p as Profile | null;
      setProfile(prof);

      // Faculty: see complaints in their department. Others: see own complaints.
      let query = supabase.from("complaints").select("*").order("created_at", { ascending: false });
      if (prof?.role === "faculty" && prof.department) {
        query = query.eq("category", prof.department);
      } else {
        query = query.eq("user_id", user.id);
      }
      const { data: c } = await query;
      const list = (c as Complaint[]) ?? [];
      setComplaints(list);

      // For faculty view, fetch reporter names (skip anonymous).
      if (prof?.role === "faculty") {
        const ids = Array.from(new Set(list.filter((x) => !x.anonymous).map((x) => x.user_id)));
        if (ids.length) {
          const { data: profs } = await supabase
            .from("profiles")
            .select("id,full_name")
            .in("id", ids);
          const map: Record<string, string> = {};
          (profs ?? []).forEach((r: { id: string; full_name: string }) => { map[r.id] = r.full_name; });
          setReporters(map);
        }
      }
      setBusy(false);
    })();
  }, [user]);

  if (loading) return <div className="container mx-auto p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const isFaculty = profile?.role === "faculty";

  const toggleStatus = async (c: Complaint) => {
    const newStatus = c.status === "resolved" ? "pending" : "resolved";
    const { error } = await supabase.from("complaints").update({ status: newStatus }).eq("id", c.id);
    if (error) return toast.error(error.message);
    setComplaints((prev) => prev.map((x) => x.id === c.id ? { ...x, status: newStatus } : x));
    toast.success(`Marked as ${newStatus}`);
  };

  const removeComplaint = async (id: string) => {
    if (!confirm("Delete this complaint?")) return;
    const { error } = await supabase.from("complaints").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setComplaints((prev) => prev.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  return (
    <section className="container mx-auto px-4 py-10 max-w-6xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {isFaculty
            ? `Complaints in your department: ${profile?.department ?? "—"}`
            : "Manage your profile and complaints"}
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <aside className="bg-accent/40 rounded-xl border p-6 md:col-span-1 h-fit">
          <h2 className="font-bold text-lg mb-4">Your Profile</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="font-semibold">Name:</dt><dd>{profile?.full_name ?? "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="font-semibold">Email:</dt><dd className="truncate">{profile?.email ?? "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="font-semibold">Role:</dt><dd className="capitalize">{profile?.role ?? "—"}</dd></div>
            {isFaculty && (
              <div className="flex justify-between gap-3"><dt className="font-semibold">Dept:</dt><dd>{profile?.department ?? "—"}</dd></div>
            )}
          </dl>
        </aside>

        <div className="bg-accent/40 rounded-xl border p-6 md:col-span-2">
          <h2 className="font-bold text-lg mb-4">
            {isFaculty ? "Department Complaints" : "Your Complaints"}
          </h2>
          {busy ? <p className="text-sm text-muted-foreground">Loading...</p> :
            complaints.length === 0 ? <p className="text-sm text-muted-foreground">No complaints yet.</p> : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {complaints.map((c) => (
                <article key={c.id} className="border-l-4 border-primary bg-card rounded-lg p-4 text-sm">
                  <p><strong>Category:</strong> {c.category}</p>
                  <p><strong>Issue:</strong> {c.issue}</p>
                  <p><strong>Location:</strong> {c.location}</p>
                  <p><strong>Description:</strong> {c.description}</p>
                  <p><strong>By:</strong> {c.anonymous ? "Anonymous" : (isFaculty ? (reporters[c.user_id] ?? "Student") : profile?.full_name)}</p>
                  <p><strong>Status:</strong>{" "}
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${c.status === "resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {c.status}
                    </span>
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => toggleStatus(c)}>
                      Mark as {c.status === "resolved" ? "Pending" : "Resolved"}
                    </Button>
                    {!isFaculty && (
                      <Button size="sm" variant="destructive" onClick={() => removeComplaint(c.id)}>Delete</Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}