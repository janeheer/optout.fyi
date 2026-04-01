"use client";

import { useMemo, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Check, Copy, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Disclaimer } from "@/components/disclaimer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { allRequestTypes, type RequestType } from "@/legal/citations";
import { companies } from "@/legal/companies";
import { generateComplaintLetter } from "@/legal/templates";
import { defaultLang, formatCopy, t, type Lang } from "@/lib/i18n";

export default function GuidePage() {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [sentDateStr, setSentDateStr] = useState("");
  const [selectedRights, setSelectedRights] = useState<Set<RequestType>>(
    new Set(["RIGHT_TO_DELETE", "OPT_OUT_SALE"])
  );
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [complaintLetter, setComplaintLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const s = t[lang];
  const locale = lang === "es" ? "es-US" : "en-US";
  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) ?? null;

  const deadlineInfo = useMemo(() => {
    if (!sentDateStr) return null;
    const sent = new Date(`${sentDateStr}T00:00:00`);
    if (Number.isNaN(sent.getTime())) return null;
    const deadline = new Date(sent.getTime() + 45 * 24 * 60 * 60 * 1000);
    const daysRemaining = differenceInCalendarDays(deadline, new Date());
    return { sent, deadline, daysRemaining };
  }, [sentDateStr]);

  const handleGenerateComplaint = () => {
    if (!selectedCompany || !deadlineInfo || !senderName.trim() || !senderEmail.trim()) return;
    setComplaintLetter(
      generateComplaintLetter(
        {
          senderName: senderName.trim(),
          senderEmail: senderEmail.trim(),
          company: selectedCompany,
          requestTypes: Array.from(selectedRights),
        },
        deadlineInfo.sent
      )
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(complaintLetter);
    setCopied(true);
    toast.success(s.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([complaintLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "optout-complaint.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header lang={lang} onToggleLanguage={() => setLang(lang === "es" ? "en" : "es")} />
      <main id="main-content" className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:py-8">
          <div className="sr-only" aria-live="polite">
            {complaintLetter ? s.statusComplaintGenerated : s.guideSubtitle}
          </div>

          <section className="surface-panel p-6 sm:p-8">
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{s.guideTitle}</h1>
              <p className="text-base leading-7 text-muted-foreground">{s.guideSubtitle}</p>
              <Disclaimer lang={lang} />
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <Card className="border border-border/70 bg-background/40">
              <CardHeader>
                <CardTitle>{s.guideKnowRightsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>{s.guideKnowRightsBody1}</p>
                <p>{s.guideKnowRightsBody2}</p>
                <div>
                  <h2 className="text-base font-semibold text-foreground">{s.guideDeadlinesTitle}</h2>
                  <ul className="mt-3 space-y-2">
                    {s.guideDeadlinesItems.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/70 bg-background/40">
              <CardHeader>
                <CardTitle>{s.guideDeliveryTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <DeliveryBlock title={s.guideDeliveryEmailTitle} body={s.guideDeliveryEmailBody} />
                <DeliveryBlock title={s.guideDeliveryPortalTitle} body={s.guideDeliveryPortalBody} />
                <DeliveryBlock title={s.guideDeliveryMailTitle} body={s.guideDeliveryMailBody} />
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-8">
              <Card className="border border-border/70 bg-background/40">
                <CardHeader>
                  <CardTitle>{s.guideTrackerTitle}</CardTitle>
                  <p className="text-sm leading-6 text-muted-foreground">{s.guideTrackerHint}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sent-date">{s.sentDate}</Label>
                    <Input id="sent-date" type="date" value={sentDateStr} onChange={(event) => setSentDateStr(event.target.value)} />
                  </div>

                  {deadlineInfo ? (
                    <div className="space-y-4 rounded-2xl border border-border/70 bg-background/35 p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className={deadlineInfo.daysRemaining < 0 ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}>
                          {deadlineInfo.daysRemaining < 0
                            ? formatCopy(s.trackerStatusOverdue, { count: Math.abs(deadlineInfo.daysRemaining) })
                            : formatCopy(s.trackerStatusRemaining, { count: deadlineInfo.daysRemaining })}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {s.trackerDeadline}:{" "}
                          {deadlineInfo.deadline.toLocaleDateString(locale, {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div
                        className="h-3 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-label={s.guideTrackerTitle}
                        aria-valuemin={0}
                        aria-valuemax={45}
                        aria-valuenow={Math.max(0, Math.min(45, 45 - deadlineInfo.daysRemaining))}
                      >
                        <div
                          className={deadlineInfo.daysRemaining < 0 ? "h-full w-full bg-destructive" : "h-full bg-primary"}
                          style={{
                            width:
                              deadlineInfo.daysRemaining < 0
                                ? "100%"
                                : `${Math.max(0, Math.min(100, ((45 - deadlineInfo.daysRemaining) / 45) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{s.trackerSent}</span>
                        <span>{s.trackerDeadline}</span>
                      </div>
                      {deadlineInfo.daysRemaining < 0 ? (
                        <Alert className="border-destructive/35 bg-destructive/10">
                          <AlertTitle>{s.overdueTitle}</AlertTitle>
                          <AlertDescription>{s.trackerOverdueHelp}</AlertDescription>
                        </Alert>
                      ) : null}
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-background/40">
                <CardHeader>
                  <CardTitle>{s.complaintGeneratorTitle}</CardTitle>
                  <p className="text-sm leading-6 text-muted-foreground">{s.complaintGeneratorHint}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-select">{s.companyLabel}</Label>
                    <select
                      id="company-select"
                      value={selectedCompanyId}
                      onChange={(event) => setSelectedCompanyId(event.target.value)}
                      className="focus-outline h-10 w-full rounded-lg border border-input bg-background/70 px-3 text-sm"
                    >
                      <option value="">{s.companyPlaceholder}</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <fieldset className="space-y-3">
                    <legend className="text-sm font-medium">{s.rightsRequested}</legend>
                    <div className="grid gap-2">
                      {allRequestTypes.map((right) => {
                        const inputId = `guide-right-${right.type}`;
                        const checked = selectedRights.has(right.type);

                        return (
                          <div key={right.type} className="rounded-2xl border border-border/70 bg-background/35 p-3">
                            <div className="flex items-start gap-3">
                              <input
                                id={inputId}
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  setSelectedRights((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(right.type)) next.delete(right.type);
                                    else next.add(right.type);
                                    return next;
                                  })
                                }
                                className="mt-1 h-5 w-5 rounded border-input bg-background accent-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                              />
                              <Label htmlFor={inputId} className="cursor-pointer text-sm text-muted-foreground">
                                {right.label}
                              </Label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="guide-sent-date">{s.complaintDateLabel}</Label>
                      <Input id="guide-sent-date" type="date" value={sentDateStr} onChange={(event) => setSentDateStr(event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guide-name">{s.fullName}</Label>
                      <Input id="guide-name" value={senderName} onChange={(event) => setSenderName(event.target.value)} placeholder={s.fullNamePlaceholder} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guide-email">{s.email}</Label>
                    <Input id="guide-email" type="email" value={senderEmail} onChange={(event) => setSenderEmail(event.target.value)} placeholder={s.emailPlaceholder} />
                  </div>

                  <Button
                    type="button"
                    onClick={handleGenerateComplaint}
                    disabled={!selectedCompany || !deadlineInfo || !senderName.trim() || !senderEmail.trim() || !selectedRights.size}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {s.generateComplaintAction}
                  </Button>
                </CardContent>
              </Card>

              {complaintLetter ? (
                <Card className="border border-border/70 bg-background/40">
                  <CardHeader>
                    <CardTitle>{s.complaintTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea value={complaintLetter} readOnly className="min-h-[320px] bg-background/70 font-mono text-xs leading-6" aria-live="polite" />
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={handleCopy} aria-label={s.ariaCopyComplaint}>
                        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                        {copied ? s.copied : s.copy}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleDownload} aria-label={s.ariaDownloadComplaint}>
                        <Download className="h-4 w-4" aria-hidden="true" />
                        {s.download}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <Card className="border border-border/70 bg-background/40">
                <CardHeader>
                  <CardTitle>{s.filingTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                  <FilingBlock title={s.filingStepOneTitle} body={s.filingStepOneBody} items={s.filingStepOneItems} href="https://cppa.ca.gov/webapplications/complaint" />
                  <FilingBlock title={s.filingStepTwoTitle} body={s.filingStepTwoBody} items={s.filingStepTwoItems} href="https://oag.ca.gov/contact/consumer-complaint-against-business-or-company" />
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{s.filingStepThreeTitle}</h2>
                    <ul className="mt-2 space-y-2">
                      {s.filingStepThreeItems.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-background/40">
                <CardHeader>
                  <CardTitle>{s.resourcesListTitle}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <ResourceLink href="https://www.aclu.org/issues/immigrants-rights" label={s.resourceAclu} />
                  <ResourceLink href="https://www.nilc.org" label={s.resourceNilc} />
                  <ResourceLink href="https://www.eff.org" label={s.resourceEff} />
                  <ResourceLink href="https://nipnlg.org" label={s.resourceNip} />
                </CardContent>
              </Card>
            </aside>
          </section>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}

function DeliveryBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1">{body}</p>
    </div>
  );
}

function FilingBlock({
  title,
  body,
  items,
  href,
}: {
  title: string;
  body: string;
  items: readonly string[];
  href: string;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1">{body}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-outline mt-2 inline-flex items-center gap-2 rounded-sm underline underline-offset-4"
      >
        <ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" />
        {href}
      </a>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="text-primary">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-outline inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/35 p-3 text-muted-foreground transition-colors hover:bg-muted/40"
    >
      <ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
