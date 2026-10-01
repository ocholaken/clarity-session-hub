import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, count: 18 },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays, count: 12 },
  { to: "/admin/users", label: "Users", icon: Users, count: 94 },
  { to: "/admin/services", label: "Services", icon: Briefcase, count: 7 },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare, count: 3 },
  { to: "/admin/reports", label: "Reports", icon: BarChart3, count: 14 },
  { to: "/admin/settings", label: "Settings", icon: Settings, count: 1 },
];

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/admin/login", { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#070d16] text-slate-200">
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15 text-sm font-bold text-teal-300 ring-1 ring-teal-500/30">
          CS
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.14em] text-white uppercase">Clarity Sector</p>
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Ops Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map(({ to, label, icon: Icon, end, count }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-slate-800 text-white shadow-[inset_0_0_0_1px_rgba(45,212,191,0.15)]"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              )
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              {label}
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
              {count}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div className="mb-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Signed in</p>
          <p className="mt-1 truncate text-sm font-medium text-white">{user?.email}</p>
        </div>
        <Button variant="secondary" className="w-full justify-start gap-3 bg-slate-800 text-white hover:bg-slate-700" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#071118] text-slate-100">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col border-r border-slate-800 bg-[#070d16] shadow-2xl shadow-slate-950/50">
        <SidebarContent />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-950/80" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-[#070d16] border-r border-slate-800">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#071118]/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden rounded-lg border border-slate-700 p-2 text-slate-200 hover:bg-slate-800"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle admin menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-teal-300">Mission Control</p>
                <h1 className="text-lg font-semibold tracking-[0.16em] text-white sm:text-xl">CLARITY SECTOR</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200">
                Admin
              </span>
              <Button variant="outline" className="hidden border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 sm:inline-flex" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
