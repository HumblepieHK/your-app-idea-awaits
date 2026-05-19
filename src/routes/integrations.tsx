import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plug, CheckCircle2, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MSO_PLATFORMS, type MsoPlatform } from "@/lib/data";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/integrations")({
  component: IntegrationsPage,
  head: () => ({ meta: [{ title: "Integrations — Totonou" }] }),
});

function IntegrationsPage() {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<MsoPlatform[]>(MSO_PLATFORMS);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!getSession()) navigate({ to: "/" });
  }, [navigate]);

  const toggle = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Connected" ? "Available" : "Connected" }
          : p,
      ),
    );
    const target = platforms.find((p) => p.id === id);
    if (target) {
      setToast(
        target.status === "Connected"
          ? `${target.name} disconnected.`
          : `${target.name} connected.`,
      );
      setTimeout(() => setToast(null), 1800);
    }
  };

  const grouped = platforms.reduce<Record<string, MsoPlatform[]>>((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  return (
    <AppShell>
      {toast && (
        <div className="fixed left-1/2 top-24 z-50 flex w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl bg-secondary p-4 shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <span className="text-sm font-medium text-white">{toast}</span>
        </div>
      )}

      <section className="rounded-3xl bg-secondary p-5 text-white">
        <Plug className="h-5 w-5 text-primary-foreground" />
        <p className="mt-2 text-lg font-black">MSO Platform Plug-ins</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Connect Totonou to your Money Service Operator stack — screening, blockchain analytics,
          KYC and Travel Rule.
        </p>
      </section>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mt-6">
          <h2 className="mb-3 ml-1 text-xs font-black text-muted-foreground">
            {cat.toUpperCase()}
          </h2>
          <ul className="space-y-3">
            {items.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-3xl border bg-card p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                  <span className="text-sm font-black text-primary">
                    {p.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-secondary">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.description}</p>
                </div>
                <button
                  onClick={() => toggle(p.id)}
                  className={`flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-black transition ${
                    p.status === "Connected"
                      ? "bg-success/10 text-success"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {p.status === "Connected" ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" /> CONNECTED
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3" /> CONNECT
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </AppShell>
  );
}
