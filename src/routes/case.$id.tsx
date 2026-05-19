import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, UserCheck, CheckCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ALERTS } from "@/lib/data";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/case/$id")({
  component: CasePage,
  head: () => ({ meta: [{ title: "Case — Totonou" }] }),
});

function CasePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);
  const alert = ALERTS.find((a) => a.id === id);

  useEffect(() => {
    if (!getSession()) navigate({ to: "/" });
  }, [navigate]);

  const handleSend = () => {
    setToast(true);
    setTimeout(() => {
      setToast(false);
      navigate({ to: "/alerts" });
    }, 1600);
  };

  return (
    <AppShell>
      {toast && (
        <div className="fixed left-1/2 top-24 z-50 flex w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl bg-secondary p-4 shadow-xl">
          <CheckCircle className="h-5 w-5 text-success" />
          <span className="text-sm font-medium text-white">Compliance notice dispatched.</span>
        </div>
      )}

      <button
        onClick={() => navigate({ to: "/alerts" })}
        className="mb-4 flex items-center gap-1 text-xs font-bold text-muted-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Queue
      </button>

      {!alert ? (
        <p className="text-sm text-muted-foreground">Case not found.</p>
      ) : (
        <>
          <div className="rounded-3xl bg-secondary p-5">
            <p className="text-[10px] font-black text-muted-foreground">
              CASE SUBJECT: <span className="text-[13px] text-white">{alert.recipient}</span>
            </p>
            <p className="mt-2 text-[10px] font-black text-muted-foreground">
              SCREENING SCORE:{" "}
              <span className="text-[13px] text-white">
                {alert.isCritical ? "92% (PEP MATCH)" : "Within tolerance"}
              </span>
            </p>
          </div>

          <textarea
            className="mt-3 min-h-[280px] w-full rounded-3xl bg-card p-5 text-[15px] leading-[22px] text-foreground/80 outline-none focus:ring-2 focus:ring-ring"
            defaultValue={`OFFICIAL NOTICE: Compliance Ref ${alert.id}\n\nOur Name Screening engine (Totonou) has flagged your recent HKD stablecoin transaction.\n\nPlease provide:\n1. Full Legal Name\n2. Proof of Funds / Source of Wealth\n3. Relationship to Beneficiary\n\nRequired under HKMA Stablecoin Ordinance 2026.`}
          />

          <button
            onClick={handleSend}
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-3xl bg-secondary p-5 font-black text-white transition active:scale-[0.99]"
          >
            REQUEST DOCUMENTATION
            <UserCheck className="h-[18px] w-[18px]" />
          </button>
        </>
      )}
    </AppShell>
  );
}
