"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/lib/site-config";

type Status = "unknown" | "granted" | "denied";

type Ctx = {
  status: Status;
  required: boolean;
  grant: () => void;
  deny: () => void;
};

const ConsentContext = createContext<Ctx>({
  status: "unknown",
  required: false,
  grant: () => {},
  deny: () => {},
});

const KEY = `${siteConfig.shortName}-consent-v1`;

export function ConsentProvider({
  children,
  required,
}: {
  children: React.ReactNode;
  required: boolean;
}) {
  const [status, setStatus] = useState<Status>(required ? "unknown" : "granted");

  useEffect(() => {
    if (!required) return;
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored === "granted" || stored === "denied") {
        setStatus(stored);
      }
    } catch {
      /* private mode / quota — leave as unknown */
    }
  }, [required]);

  const grant = useCallback(() => {
    setStatus("granted");
    try {
      window.localStorage.setItem(KEY, "granted");
    } catch {
      /* silent */
    }
  }, []);

  const deny = useCallback(() => {
    setStatus("denied");
    try {
      window.localStorage.setItem(KEY, "denied");
    } catch {
      /* silent */
    }
  }, []);

  const value = useMemo(() => ({ status, required, grant, deny }), [status, required, grant, deny]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  return useContext(ConsentContext);
}
