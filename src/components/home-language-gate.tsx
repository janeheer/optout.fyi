"use client";

import { Globe, Shield } from "lucide-react";
import type { Lang } from "@/lib/i18n";

interface HomeLanguageGateProps {
  onSelectLanguage: (lang: Lang) => void;
}

export function HomeLanguageGate({ onSelectLanguage }: HomeLanguageGateProps) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center px-4 py-10"
    >
      <section className="surface-panel w-full max-w-2xl px-6 py-10 text-center sm:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10">
          <Shield className="h-7 w-7 text-emerald-300" aria-hidden="true" />
        </div>
        <p className="mt-6 text-lg font-medium text-foreground">
          Choose your language / Elige tu idioma
        </p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Pick the language you want to read the tool in. Proper company names stay in English.
          <br />
          Elige el idioma en que quieres usar la herramienta. Los nombres oficiales de las empresas se mantienen en inglés.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelectLanguage("es")}
            aria-label="Elegir Español"
            className="focus-outline flex min-h-28 flex-col items-center justify-center rounded-3xl border border-primary/45 bg-primary/12 px-6 py-5 text-center transition-colors hover:bg-primary/18"
          >
            <Globe className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="mt-3 text-xl font-semibold text-foreground">Español</span>
            <span className="mt-1 text-sm text-muted-foreground">Spanish-first experience</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage("en")}
            aria-label="Choose English"
            className="focus-outline flex min-h-28 flex-col items-center justify-center rounded-3xl border border-border/70 bg-card/70 px-6 py-5 text-center transition-colors hover:bg-muted/70"
          >
            <Globe className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="mt-3 text-xl font-semibold text-foreground">English</span>
            <span className="mt-1 text-sm text-muted-foreground">Read the tool in English</span>
          </button>
        </div>
      </section>
    </main>
  );
}
