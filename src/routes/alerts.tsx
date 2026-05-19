import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ALERTS } from "@/lib/data";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/alerts")({
  component: AlertsPage,
  head: () => ({ meta: [{ title: "Alerts — Totonou" }] }),
});

function AlertsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getSession()) navigate({ to: "/" });
  }, [navigate]);

  return (
    <AppShell>
      <h2 className="mb-3 ml-1 text-xs font-black text-muted-foreground">COMPLIANCE QUEUE</h2>
      <ul className="space-y-3">
        {ALERTS.map((alert) => (
          <li
            key={alert.id}
            className={`flex items-center gap-3 rounded-3xl border bg-card p-5 ${
              alert.isCritical ? "border-l-4 border-l-destructive border-destructive/30" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-md bg-muted px-2 py-1 text-[9px] font-black text-primary">
                  {alert.type.toUpperCase()}
                </span>
                <span
                  className={`rounded-md px-2 py-1 text-[9px] font-black ${
                    alert.screeningStatus === "Flagged"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {alert.screeningStatus}
                </span>
              </div>
              <p className="text-[15px] font-bold text-secondary">{alert.subject}</p>
              <p className="mt-1 text-xs leading-[18px] text-muted-foreground">{alert.details}</p>
            </div>
            <Link
              to="/case/$id"
              params={{ id: alert.id }}
              aria-label={`Open case ${alert.id}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-surface-muted transition hover:bg-muted"
            >
              <Search className="h-4 w-4 text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
