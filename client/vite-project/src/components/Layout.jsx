import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban }
  ];

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TF";

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white/95 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3" onClick={closeMobile}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300 shadow-lg shadow-slate-900/15">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-950">
                TeamFlow
              </h1>
            </div>
          </Link>

          <button
            aria-label="Close navigation"
            onClick={closeMobile}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Signed in as
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-sm font-black text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950">
                {user?.name || "Team member"}
              </p>
              <p className="truncate text-xs font-medium text-slate-500">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.path === "/dashboard"
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition ${
                  active
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={active ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-600"}
                  />
                  {item.name}
                </span>
                {active && <span className="h-2 w-2 rounded-full bg-cyan-300" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-2 text-cyan-700 shadow-sm">
                <Bell size={18} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-950">
                  Task focus
                </p>
                <p className="text-xs leading-5 text-slate-500">
                  Review overdue work before planning the next sprint.
                </p>
              </div>
            </div>
          </div>

          <button onClick={logout} className="btn-danger w-full">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
                className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-sm font-black text-slate-950 sm:text-base">
                  {location.pathname.startsWith("/projects") ? "Projects" : "Dashboard"}
                </p>
                <p className="hidden text-xs font-medium text-slate-500 sm:block">
                  Team task manager workspace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-black text-slate-950">
                  {user?.name || "Team member"}
                </p>
                <p className="text-xs text-slate-500">Online</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-xs font-black text-cyan-300">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
