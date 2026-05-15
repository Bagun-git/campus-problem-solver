import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type Row = {
  id: string; category: string; issue: string; location: string;
  description: string; status: string; anonymous: boolean; created_at: string; user_id: string;
};

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Campus Problem Solver" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) return;
    supabase.from("complaints").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setRows((data as Row[]) ?? []);
      setBusy(false);
    });
  }, [user, isAdmin]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return (
    <div className="container mx-auto p-10 text-center">
      <h1 className="text-2xl font-bold">Access denied</h1>
      <p className="text-muted-foreground mt-2">You need admin privileges to view this page.</p>
    </div>
  );

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("complaints").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((p) => p.map((r) => r.id === id ? { ...r, status } : r));
    toast.success(`Marked ${status}`);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("complaints").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((p) => p.filter((r) => r.id !== id));
  };

  return (
    <section className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">All complaints across the campus.</p>
      {busy ? <p>Loading...</p> : rows.length === 0 ? <p className="text-muted-foreground">No complaints yet.</p> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <article key={r.id} className="border rounded-lg p-4 bg-card text-sm">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <div>
                  <span className="font-semibold">{r.category}</span> · <span>{r.issue}</span> · <span className="text-muted-foreground">{r.location}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.status === "resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{r.status}</span>
              </div>
              <p>{r.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {r.anonymous ? "Anonymous" : `User: ${r.user_id.slice(0, 8)}…`} · {new Date(r.created_at).toLocaleString()}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => setStatus(r.id, r.status === "resolved" ? "pending" : "resolved")}>
                  Mark as {r.status === "resolved" ? "Pending" : "Resolved"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(r.id)}>Delete</Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}