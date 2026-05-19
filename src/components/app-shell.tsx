import { Link, useLocation } from "@tanstack/react-router";
import { Bell, LayoutDashboard, Plug, LogOut, ShieldCheck } from "lucide-react";
import { setSession } from "@/lib/auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const nav = [
    { to: "/home", icon: LayoutDashboard, label: "Home" },
    { to: "/alerts", icon: Bell, label: "Alerts" },
    { to: "/integrations", icon: Plug, label: "Integrations" },
  ] as const;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="flex h-20 items-center justify-between border-b bg-card px-5 pt-2">
        <Link to="/home" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-secondary">TOTONOU</h1>
            <p className="text-[9px] font-bold text-muted-foreground">Powered by TranSentinel</p>
          </div>
        </Link>
        <button
          onClick={() => setSession(null)}
          aria-label="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded-full border bg-surface-muted"
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-28">{children}</main>

      <nav className="fixed bottom-0 left-1/2 flex h-20 w-full max-w-md -translate-x-1/2 items-center justify-around border-t bg-card pb-5">
        {nav.map((n) => {
          const active = loc.pathname === n.to || (n.to === "/alerts" && loc.pathname.startsWith("/case"));
          return (
            <Link key={n.to} to={n.to} className="flex flex-col items-center gap-1">
              <n.icon className={`h-6 w-6 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>
                {n.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
