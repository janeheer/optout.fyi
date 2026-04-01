"use client";

import { useState } from "react";
import { BookOpen, Database, ExternalLink, Lock, Shield } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLang, t, type Lang } from "@/lib/i18n";

const resources = [
  {
    key: "brokers",
    icon: Database,
    links: [
      {
        name: "Big-Ass Data Broker Opt-Out List",
        url: "https://github.com/yaelwrites/big-ass-data-broker-opt-out-list",
      },
      {
        name: "California Delete Act (SB 362) Data Broker Registry",
        url: "https://cppa.ca.gov/data_broker_registry/",
      },
    ],
  },
  {
    key: "immigrant",
    icon: Shield,
    links: [
      { name: "EPIC - Immigrant Data Rights", url: "https://epic.org/issues/data-protection/immigrant-data/" },
      { name: "National Immigration Law Center", url: "https://www.nilc.org" },
      { name: "National Immigration Project", url: "https://nipnlg.org" },
      { name: "ACLU Immigrants' Rights Project", url: "https://www.aclu.org/issues/immigrants-rights" },
    ],
  },
  {
    key: "security",
    icon: Lock,
    links: [
      { name: "EFF - Surveillance Self-Defense", url: "https://ssd.eff.org" },
      { name: "Electronic Frontier Foundation", url: "https://www.eff.org" },
      { name: "Access Now - Digital Security Helpline", url: "https://www.accessnow.org/help/" },
    ],
  },
] as const;

export default function ResourcesPage() {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const s = t[lang];

  return (
    <>
      <Header lang={lang} onToggleLanguage={() => setLang(lang === "es" ? "en" : "es")} />
      <main id="main-content" className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:py-8">
          <section className="surface-panel p-6 sm:p-8">
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{s.resourcesPageTitle}</h1>
              <p className="text-base leading-7 text-muted-foreground">{s.resourcesPageIntro}</p>
              <Disclaimer lang={lang} />
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-3">
            {resources.map((section) => {
              const title =
                section.key === "brokers"
                  ? s.resourcesDataBrokerTitle
                  : section.key === "immigrant"
                    ? s.resourcesImmigrantTitle
                    : s.resourcesSecurityTitle;
              const body =
                section.key === "brokers"
                  ? s.resourcesDataBrokerBody
                  : section.key === "immigrant"
                    ? s.resourcesImmigrantBody
                    : s.resourcesSecurityBody;

              return (
                <Card key={section.key} className="border border-border/70 bg-background/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <section.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      {title}
                    </CardTitle>
                    <p className="text-sm leading-6 text-muted-foreground">{body}</p>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm">
                    {section.links.map((resource) => (
                      <a
                        key={resource.name}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-outline inline-flex items-start gap-3 rounded-2xl border border-border/70 bg-background/35 p-3 text-muted-foreground transition-colors hover:bg-muted/40"
                      >
                        <ExternalLink className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                        <span>{resource.name}</span>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <Card className="border border-border/70 bg-background/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
                {s.resourcesWhyTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                {s.resourcesWhyItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
