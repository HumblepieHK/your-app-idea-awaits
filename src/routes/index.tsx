import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { getSession, setSession } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign In — Totonou" },
      { name: "description", content: "Sign in to the Totonou HKD stablecoin compliance console." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [org, setOrg] = useState("Zetrov Treasury");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getSession()) navigate({ to: "/home" });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setSession({ email, org });
    navigate({ to: "/home" });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="rounded-3xl bg-primary p-4 shadow-lg shadow-primary/30">
            <ShieldCheck className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white">Totonou</h1>
          <p className="mt-1 text-xs font-bold text-muted-foreground">Powered by TranSentinel</p>
        </div>

        <form onSubmit={submit} className="space-y-3 rounded-3xl bg-card p-5">
          <label className="block">
            <span className="text-[10px] font-black text-muted-foreground">WORK EMAIL</span>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-surface-muted px-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="compliance@zetrov.hk"
                className="w-full bg-transparent py-3 text-sm outline-none"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[10px] font-black text-muted-foreground">PASSWORD</span>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-surface-muted px-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent py-3 text-sm outline-none"
                autoComplete="current-password"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[10px] font-black text-muted-foreground">ORGANISATION</span>
            <select
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="mt-1 w-full rounded-2xl border bg-surface-muted px-3 py-3 text-sm outline-none"
            >
              <option>Zetrov Treasury</option>
              <option>HKDR Issuer Ltd</option>
              <option>TranSentinel Demo</option>
            </select>
          </label>

          {error && <p className="text-xs font-bold text-destructive">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary p-4 text-sm font-black text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
          >
            SIGN IN <ArrowRight className="h-4 w-4" />
          </button>

          <p className="pt-1 text-center text-[10px] text-muted-foreground">
            Demo build — any credentials work.{" "}
            <Link to="/integrations" className="font-bold text-primary">
              View integrations
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
