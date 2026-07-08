import { createContext, useContext, useMemo, ReactNode, CSSProperties } from "react";
import { useOptionsPage } from "@/integrations/wordpress/hooks";

const PAGE_KEYS = [
  "header",
  "footer",
  "home",
  "dispatchers",
  "faq",
  "guarantees",
  "trust",
  "services",
  "about",
] as const;

type Ctx = {
  loaded: boolean;
  byKey: Record<string, string>;
  styleByKey: Record<string, CSSProperties>;
  get: (page: string, block: string, fallback?: string) => string;
};

const SiteContentContext = createContext<Ctx | null>(null);

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const queries = {
    header: useOptionsPage("header"),
    footer: useOptionsPage("footer"),
    home: useOptionsPage("home"),
    dispatchers: useOptionsPage("dispatchers"),
    faq: useOptionsPage("faq"),
    guarantees: useOptionsPage("guarantees"),
    trust: useOptionsPage("trust"),
    services: useOptionsPage("services"),
    about: useOptionsPage("about"),
  };

  const value = useMemo<Ctx>(() => {
    const byKey: Record<string, string> = {};
    const styleByKey: Record<string, CSSProperties> = {};
    let loaded = true;
    for (const key of PAGE_KEYS) {
      const q = queries[key];
      if (q.isLoading) loaded = false;
      if (q.data) {
        Object.assign(byKey, q.data.byKey);
        Object.assign(styleByKey, q.data.styleByKey);
      }
    }
    return {
      loaded,
      byKey,
      styleByKey,
      get: (page, block, fallback = "") => byKey[`${page}.${block}`] ?? fallback,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, PAGE_KEYS.map((k) => queries[k].data));

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    return {
      loaded: false,
      byKey: {},
      styleByKey: {},
      get: (_p: string, _b: string, fallback = "") => fallback,
    } as Ctx;
  }
  return ctx;
};

/**
 * Read-only content block. Editing now happens in wp-admin (Site Content options
 * pages), not inline on the live site — this component is presentational only.
 * Kept as a drop-in replacement for the old click-to-edit `<EC>` so the ~90 call
 * sites in About.tsx and elsewhere need zero changes.
 */
export const EC = ({
  page,
  k,
  defaultText = "",
  as: As = "span",
  className,
}: {
  page: string;
  k: string;
  defaultText?: string;
  as?: any;
  className?: string;
  kind?: "text" | "textarea" | "html";
  label?: string;
}) => {
  const { get, styleByKey } = useSiteContent();
  const value = get(page, k, defaultText);
  const style = styleByKey[`${page}.${k}`];
  return <As className={className} style={style}>{value}</As>;
};
