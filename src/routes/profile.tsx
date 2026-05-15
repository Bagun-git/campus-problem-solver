import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { deleteMyAccount } from "@/lib/account.functions";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Campus Problem Solver" }] }),
  component: ProfilePage,
});

type Profile = { full_name: string; email: string; role: string };

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const callDeleteAccount = useServerFn(deleteMyAccount);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from("profiles").select("full_name,email,role").eq("id", user.id).maybeSingle(),
        supabase.from("complaints").select("status").eq("user_id", user.id),
      ]);
      setProfile(p as Profile | null);
      setFullName((p as Profile | null)?.full_name ?? "");
      const list = (c as { status: string }[]) ?? [];
      setStats({
        total: list.length,
        pending: list.filter((x) => x.status !== "resolved").length,
        resolved: list.filter((x) => x.status === "resolved").length,
      });
      setBusy(false);
    })();
  }, [user]);

  if (loading) return <div className="container mx-auto p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Name cannot be empty");
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    setProfile((p) => (p ? { ...p, full_name: fullName.trim() } : p));
    toast.success("Profile updated");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPw !== confirmPw) return toast.error("Passwords do not match");
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwSaving(false);
    if (error) return toast.error(error.message);
    setNewPw("");
    setConfirmPw("");
    toast.success("Password updated");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Permanently delete your account and all data? This cannot be undone.")) return;
    try {
      await callDeleteAccount({ userId: user?.id });
      await signOut();
      toast.success("Account deleted");
      navigate({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete account");
    }
  };

  const initials = (profile?.full_name || profile?.email || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="container mx-auto px-4 py-10 max-w-5xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Your account details and activity</p>
      </header>

      {busy ? (
        <p className="text-center text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <aside className="bg-accent/40 rounded-xl border p-6 text-center md:col-span-1 h-fit">
            <div className="mx-auto h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
              {initials || <UserIcon className="h-10 w-10" />}
            </div>
            <h2 className="mt-4 text-xl font-bold">{profile?.full_name}</h2>
            <p className="text-sm text-muted-foreground truncate">{profile?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">
              {profile?.role}
            </span>

            <dl className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="bg-card rounded-lg p-3 border">
                <dt className="text-xs text-muted-foreground">Total</dt>
                <dd className="text-lg font-bold">{stats.total}</dd>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <dt className="text-xs text-muted-foreground">Pending</dt>
                <dd className="text-lg font-bold text-yellow-600">{stats.pending}</dd>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <dt className="text-xs text-muted-foreground">Resolved</dt>
                <dd className="text-lg font-bold text-green-600">{stats.resolved}</dd>
              </div>
            </dl>
          </aside>

          <div className="bg-accent/40 rounded-xl border p-6 md:col-span-2">
            <h2 className="font-bold text-lg mb-4">Edit Details</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-11 rounded-lg" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile?.email ?? ""} disabled className="mt-1 h-11 rounded-lg bg-muted" />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile?.role ?? ""} disabled className="mt-1 h-11 rounded-lg bg-muted capitalize" />
              </div>
              <Button type="submit" disabled={saving} className="h-11 px-6">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="font-bold text-lg flex items-center gap-2 hover:text-primary transition-colors"
              >
                Change Password
                <span className="text-sm">{showPw ? "▲" : "▼"}</span>
              </button>
              {showPw && (
                <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="new_pw">New Password</Label>
                    <Input id="new_pw" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="mt-1 h-11 rounded-lg" />
                  </div>
                  <div>
                    <Label htmlFor="confirm_pw">Confirm Password</Label>
                    <Input id="confirm_pw" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="mt-1 h-11 rounded-lg" />
                  </div>
                  <Button type="submit" disabled={pwSaving} variant="secondary" className="h-11 px-6">
                    {pwSaving ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              )}
            </div>

            <div className="mt-8 pt-6 border-t">
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete my account
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}