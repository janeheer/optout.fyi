import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { Shield } from "lucide-react";

interface FooterProps {
  lang: Lang;
}

export function Footer({ lang }: FooterProps) {
  const s = t[lang];

  return (
    <footer className="mt-auto border-t border-border/70 bg-card/30 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 text-sm text-muted-foreground md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10">
            <Shield className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium text-foreground">{s.appName}</p>
            <p>{s.footerTagline}</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-3">
          <p>{s.footerBody}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-foreground">
            <a
              href="https://www.nilc.org"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm underline decoration-muted-foreground/70 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              NILC
            </a>
            <a
              href="https://www.aclu.org/issues/immigrants-rights"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm underline decoration-muted-foreground/70 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              ACLU
            </a>
            <a
              href="https://www.eff.org"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm underline decoration-muted-foreground/70 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              EFF
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
