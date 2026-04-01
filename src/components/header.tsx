"use client";

import Link from "next/link";
import { Globe, Shield } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  lang: Lang;
  onToggleLanguage?: () => void;
}

export function Header({ lang, onToggleLanguage }: HeaderProps) {
  const s = t[lang];

  return (
    <header className="border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label={s.navHome}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10">
            <Shield className="h-5 w-5 text-emerald-300" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">{s.appName}</span>
            <span className="text-xs text-muted-foreground">{s.footerTagline}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 sm:flex"
          >
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {s.navHome}
            </Link>
            <Link
              href="/generate"
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {s.navGenerate}
            </Link>
            <Link
              href="/guide"
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {s.navGuide}
            </Link>
          </nav>

          {onToggleLanguage ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleLanguage}
              aria-label={s.languageToggleLabel}
              className="min-w-28 rounded-full border-border/70 bg-card/60"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              {s.otherLang}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
