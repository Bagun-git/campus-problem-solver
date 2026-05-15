import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";
import { User as UserIcon } from "lucide-react";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Campus Problem Solver" className="h-10 w-10 rounded-full object-contain" />
          <span className="font-bold text-lg hidden sm:inline">Campus Problem Solver</span>
          <span className="font-bold text-base sm:hidden">CPSP</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link to="/" className="text-primary hover:underline">Home</Link>
          {!user ? (
            <>
              <Link to="/login" className="text-primary hover:underline">Login</Link>
              <Link to="/register" className="text-primary hover:underline">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-primary hover:underline">Dashboard</Link>
              <Link to="/profile" className="text-primary hover:underline">Profile</Link>
              {isAdmin && <Link to="/admin" className="text-primary hover:underline">Admin</Link>}
              <button onClick={handleLogout} className="text-primary hover:underline">Logout</button>
            </>
          )}
          <UserIcon className="h-6 w-6 text-foreground/70" />
        </nav>
      </div>
    </header>
  );
}