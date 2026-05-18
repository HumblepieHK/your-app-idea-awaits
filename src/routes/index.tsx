import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  Bell,
  LogOut,
  ChevronLeft,
  CheckCircle,
  Search,
  UserCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: TotonouApp,
  head: () => ({
    meta: [
      { title: "Totonou — Powered by TranSentinel" },
      {
        name: "description",
        content:
          "Totonou compliance console: HKD stablecoin transaction screening, Travel Rule alerts, and PEP name matching.",
      },
    ],
  }),
});

type Alert = {
  id: string;
  recipient: string;
  type: string;
  subject: string;
  details: string;
  screeningStatus: "Pending" | "Flagged" | "Clear";
  isCritical?: boolean;
};

const ALERTS: Alert[] = [
  {
    id: "TX-8829",
    recipient: "blockchain.user@provider.hk",
    type: "Travel Rule Trigger",
    subject: "Action Required: Transfer > HK$8,000",
    details: "Transaction of 12,500 HKDR detected. Originator info missing.",
    screeningStatus: "Pending",
  },
  {
    id: "TX-5521",
    recipient: "li.wei@hk-mail.com",
    type: "Name Screening Hit",
    subject: "CRITICAL: PEP Match Detected",
    details:
      'Name "Li Wei" matches HKMA Watchlist (Fuzzy: 92%). Verify Source of Wealth.',
    screeningStatus: "Flagged",
    isCritical: true,
  },
  {
    id: "TX-7742",
    recipient: "treasury@zetrov.hk",
    type: "Stablecoin De-peg",
    subject: "Liquidity Alert: HKDR Deviation",
    details: "HKDR trading at 0.985. Check reserve attestations via HKMA portal.",
    screeningStatus: "Clear",
  },
];

function TotonouApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState<"alerts" | "email">("alerts");
  const [selected, setSelected] = useState<Alert | null>(null);
  const [toast, setToast] = useState(false);

  const handleSend = () => {
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setSelected(null);
      setScreen("alerts");
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-5">
        <div className="rounded-3xl bg-primary p-5 shadow-lg shadow-primary/30">
          <ShieldCheck className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Totonou</h1>
        <p className="mt-1 text-xs font-bold text-muted-foreground">
          Powered by TranSentinel
        </p>
        <button
          onClick={() => setIsLoggedIn(true)}
          className="mt-10 w-full max-w-sm rounded-2xl bg-primary p-[18px] text-base font-bold text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
        >
          Sign In
        </button>
      </main>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-background">
      {toast && (
        <div className="fixed left-1/2 top-24 z-50 flex w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl bg-secondary p-4 shadow-xl">
          <CheckCircle className="h-5 w-5 text-success" />
          <span className="text-sm font-medium text-white">
            Compliance notice dispatched.
          </span>
        </div>
      )}

      <header className="flex h-20 items-center justify-between border-b bg-card px-5 pt-2">
        <div>
          <h1 className="text-lg font-black tracking-tight text-secondary">TOTONOU</h1>
          <p className="text-[9px] font-bold text-muted-foreground">
            Powered by TranSentinel • Mar 2026
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
          <span className="text-sm font-bold text-white">Z</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {screen === "alerts" ? (
          <>
            <section className="mb-6 flex gap-3">
              <div className="flex-1 rounded-2xl border bg-card p-4">
                <p className="text-[10px] font-bold text-muted-foreground">
                  Total Scanned
                </p>
                <p className="text-2xl font-black text-secondary">1,248</p>
              </div>
              <div className="flex-1 rounded-2xl border border-l-4 border-l-destructive bg-card p-4">
                <p className="text-[10px] font-bold text-muted-foreground">
                  Screening Hits
                </p>
                <p className="text-2xl font-black text-destructive">03</p>
              </div>
            </section>

            <h2 className="mb-3 ml-1 text-xs font-black text-muted-foreground">
              COMPLIANCE QUEUE
            </h2>

            <ul className="space-y-3">
              {ALERTS.map((alert) => (
                <li
                  key={alert.id}
                  className={`flex items-center gap-3 rounded-3xl border bg-card p-5 ${
                    alert.isCritical
                      ? "border-l-4 border-l-destructive border-destructive/30"
                      : "border-muted"
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
                    <p className="text-[15px] font-bold text-secondary">
                      {alert.subject}
                    </p>
                    <p className="mt-1 text-xs leading-[18px] text-muted-foreground">
                      {alert.details}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelected(alert);
                      setScreen("email");
                    }}
                    aria-label={`Open case ${alert.id}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-surface-muted transition hover:bg-muted"
                  >
                    <Search className="h-4 w-4 text-primary" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <button
              onClick={() => setScreen("alerts")}
              className="mb-4 flex items-center gap-1 text-xs font-bold text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Queue
            </button>

            <div className="rounded-3xl bg-secondary p-5">
              <p className="text-[10px] font-black text-muted-foreground">
                CASE SUBJECT:{" "}
                <span className="text-[13px] text-white">{selected?.recipient}</span>
              </p>
              <p className="mt-2 text-[10px] font-black text-muted-foreground">
                NAME SCREENING SCORE:{" "}
                <span className="text-[13px] text-white">92% (PEP MATCH)</span>
              </p>
            </div>

            <textarea
              className="mt-3 min-h-[280px] w-full rounded-3xl bg-card p-5 text-[15px] leading-[22px] text-foreground/80 outline-none focus:ring-2 focus:ring-ring"
              defaultValue={`OFFICIAL NOTICE: Compliance Ref ${selected?.id}\n\nOur Name Screening engine (Totonou) has flagged your recent HKD stablecoin transaction.\n\nPlease provide:\n1. Full Legal Name\n2. Proof of Funds / Source of Wealth\n3. Relationship to Beneficiary\n\nRequired under HKMA Stablecoin Ordinance 2026.`}
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
      </main>

      <nav className="fixed bottom-0 left-1/2 flex h-20 w-full max-w-md -translate-x-1/2 items-center justify-around border-t bg-card pb-5">
        <button onClick={() => setScreen("alerts")} aria-label="Alerts">
          <Bell
            className={`h-6 w-6 ${
              screen === "alerts" ? "text-primary" : "text-muted-foreground"
            }`}
          />
        </button>
        <button aria-label="Dashboard">
          <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
        </button>
        <button onClick={() => setIsLoggedIn(false)} aria-label="Sign out">
          <LogOut className="h-6 w-6 text-muted-foreground" />
        </button>
      </nav>
    </div>
  );
}
