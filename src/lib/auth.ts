import { useEffect, useState } from "react";

const KEY = "totonou_session";

export type Session = { email: string; org: string } | null;

export function getSession(): Session {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session) {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("totonou:auth"));
}

export function useSession() {
  const [session, setS] = useState<Session>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setS(getSession());
    setReady(true);
    const h = () => setS(getSession());
    window.addEventListener("totonou:auth", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("totonou:auth", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return { session, ready };
}
