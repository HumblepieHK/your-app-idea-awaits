import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { ALERTS, MSO_PLATFORMS } from "@/lib/data";
import { getSession, useSession } from "@/lib/auth";
import { ArrowRight, Bell, Plug, ShieldCheck, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/home")({
  component: HomePage,
  head: () => ({ meta: [{ title: "Home — Totonou" }] }),
});

function HomePage() {
  const navigate = useNavigate();
  const { session, ready } = useSession();
  useEffect(() => {
    if (ready && !getSession()) navigate({ to: "/" });
  }, [ready, navigate]);

  const hits = ALERTS.filter((a) => a.screeningStatus === "Flagged").length;
  const connected = MSO_PLATFORMS.filter((m) => m.status === "Connected").length;

  return (
    <AppShell>
      <section className="rounded-3xl bg-secondary p-5 text-white">
        <p className="text-[10px] font-black text-muted-foreground">WELCOME</p>
        <p className="mt-1 text-lg font-black">{session?.email ?? "Compliance Officer"}</p>
        <p className="text-xs text-muted-foreground">{session?.org}</p>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Scanned" value="1,248" icon={TrendingUp} />
        <Stat label="Hits" value={String(hits).padStart(2, "0")} icon={ShieldCheck} accent />
        <Stat label="Plugs" value={String(connected)} icon={Plug} />
      </section>

      <h2 className="mb-3 ml-1 mt-6 text-xs font-black text-muted-foreground">QUICK ACTIONS</h2>
      <div className="space-y-3">
        <ActionCard
          to="/alerts"
          icon={Bell}
          title="Review Compliance Queue"
          desc={`${ALERTS.length} open cases — ${hits} flagged`}
        />
        <ActionCard
          to="/integrations"
          icon={Plug}
          title="Connect MSO Platforms"
          desc={`${connected} of ${MSO_PLATFORMS.length} services connected`}
        />
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-3 ${accent ? "border-l-4 border-l-destructive" : ""}`}
    >
      <Icon className={`h-4 w-4 ${accent ? "text-destructive" : "text-primary"}`} />
      <p className="mt-2 text-[10px] font-bold text-muted-foreground">{label}</p>
      <p className={`text-xl font-black ${accent ? "text-destructive" : "text-secondary"}`}>
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-3xl border bg-card p-5 transition hover:bg-surface-muted"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-[15px] font-bold text-secondary">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
