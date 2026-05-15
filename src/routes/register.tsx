import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import campus from "@/assets/campus.jpg";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — Campus Problem Solver" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [department, setDepartment] = useState<string>("Cleanliness");
  const [loading, setLoading] = useState(false);

  const DEPARTMENTS = ["Cleanliness", "Discipline", "Sports", "Event", "Subject", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords don't match");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: fullName,
          role,
          department: role === "faculty" ? department : null,
        },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to verify your account!");
    navigate({ to: "/login" });
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-8 sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight">REGISTER</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-11 rounded-lg" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-11 rounded-lg" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 h-11 rounded-lg" />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 h-11 rounded-lg" />
            </div>
            <div>
              <Label className="block mb-2">Select Role</Label>
              <div className="flex gap-2">
                {(["student", "faculty"] as const).map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${role === r ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            {role === "faculty" && (
              <div>
                <Label htmlFor="department" className="block mb-2">Select Department</Label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-11 rounded-lg border bg-background px-3 text-sm"
                  required
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll see and resolve complaints in this department.
                </p>
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full h-11 text-base mt-2">
              {loading ? "Creating..." : "Register"}
            </Button>
            <p className="text-center text-sm">
              Already have account? <Link to="/login" className="text-primary font-semibold">Login</Link>
            </p>
          </form>
        </div>
        <div className="hidden md:block">
          <img src={campus} alt="Campus" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}