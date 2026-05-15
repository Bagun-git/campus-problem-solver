import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import campus from "@/assets/campus.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Campus Problem Solver" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        toast.error("Please verify your email first. Check your inbox.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const handleForgot = async () => {
    if (!email) return toast.error("Enter your email above first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset email sent. Check your inbox.");
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-8 sm:p-10 flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight">LOGIN</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 flex-1">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-11 rounded-lg" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 h-11 rounded-lg" />
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full h-11 text-base">
                {loading ? "Logging in..." : "Login"}
              </Button>
              <button type="button" onClick={handleForgot} className="block text-center text-sm mt-3 text-primary hover:underline w-full">
                Forgot password?
              </button>
              <p className="text-center text-sm mt-4">
                Don't have account? <Link to="/register" className="text-primary font-semibold">Register</Link>
              </p>
            </div>
          </form>
        </div>
        <div className="hidden md:block">
          <img src={campus} alt="Campus" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}