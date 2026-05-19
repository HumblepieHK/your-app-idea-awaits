import { useEffect, useState } from "react";

const KEY = "totonou_session";
const REMEMBER_KEY = "totonou_remember";

export type Session = { email: string; org: string } | null;

function storageFor(remember: boolean): Storage | null {
  if (typeof window === "undefined") return null;
  return remember ? window.localStorage : window.sessionStorage;
}

export function getSession(): Session {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem(KEY) ?? window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function getRemember(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(REMEMBER_KEY) !== "0";
}

export function setSession(s: Session, remember: boolean = getRemember()) {
  if (typeof window === "undefined") return;
  // Clear both stores first to avoid stale duplicates
  window.localStorage.removeItem(KEY);
  window.sessionStorage.removeItem(KEY);
  if (s) {
    const store = storageFor(remember)!;
    store.setItem(KEY, JSON.stringify(s));
    window.localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  }
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
