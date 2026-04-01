"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download, Send } from "lucide-react";
import { toast } from "sonner";
import { CompanyGroupList } from "@/components/company-group-list";
import { Disclaimer } from "@/components/disclaimer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { allRequestTypes, citations, type RequestType } from "@/legal/citations";
import { companies } from "@/legal/companies";
import { buildMailtoUrl, generateBatchLetter } from "@/legal/templates";
import { formatCopy, t, type Lang } from "@/lib/i18n";
import { markAsSent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

interface HomeGeneratorProps {
  lang: Lang;
  onStartCountdown: () => void;
}

export function HomeGenerator({ lang, onStartCountdown }: HomeGeneratorProps) {
  const s = t[lang];
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<Set<string>>(new Set());
  const [selectedRights, setSelectedRights] = useState<Set<RequestType>>(
    new Set(["RIGHT_TO_DELETE", "OPT_OUT_SALE", "LIMIT_SENSITIVE", "OPT_OUT_PROFILING"])
  );
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const selectedCompanies = useMemo(
    () => companies.filter((company) => selectedCompanyIds.has(company.id)),
    [selectedCompanyIds]
  );

  const companiesWithoutEmail = selectedCompanies.filter((company) => !company.privacyEmail);

  const mailtoUrl = useMemo(() => {
    if (!generatedLetter || selectedCompanies.length === 0) return "";

    return buildMailtoUrl({
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim(),
      companies: selectedCompanies,
      requestTypes: Array.from(selectedRights),
    });
  }, [generatedLetter, selectedCompanies, selectedRights, senderEmail, senderName]);

  const toggleCompany = (companyId: string) => {
    setSelectedCompanyIds((prev) => {
      const next = new Set(prev);
      if (next.has(companyId)) next.delete(companyId);
      else next.add(companyId);
      return next;
    });
  };

  const toggleRight = (type: RequestType) => {
    setSelectedRights((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleGenerate = () => {
    if (!selectedCompanyIds.size || !selectedRights.size || !senderName.trim() || !senderEmail.trim()) {
      return;
    }

    setGeneratedLetter(
      generateBatchLetter({
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        companies: selectedCompanies,
        requestTypes: Array.from(selectedRights),
      })
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast.success(s.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "optout-ccpa-request.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmSent = () => {
    markAsSent(Array.from(selectedCompanyIds), Array.from(selectedRights));
    setConfirmed(false);
    onStartCountdown();
    toast.success(s.markedSent);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:py-8">
      <div className="sr-only" aria-live="polite">
        {generatedLetter ? s.statusLetterGenerated : s.statusReady}
      </div>

      <section className="surface-panel p-6 sm:p-8">
        <div className="max-w-3xl space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{s.homeTagline}</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {s.homeSubtitle}
            </p>
          </div>
          <Disclaimer lang={lang} />
        </div>
      </section>

      <section className="surface-panel p-6 sm:p-8" aria-labelledby="explanation-title">
        <div className="max-w-4xl space-y-6">
          <div className="space-y-2">
            <h2 id="explanation-title" className="text-2xl font-semibold tracking-tight">
              {s.explanationTitle}
            </h2>
            <p className="text-base leading-7 text-muted-foreground">{s.explanationIntro}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoCard title={s.whatItIsTitle} body={s.whatItIsBody} />
            <InfoCard title={s.whatItDoesTitle} body={s.whatItDoesBody} />
            <Card className="border border-border/70 bg-background/35 lg:col-span-2">
              <CardContent className="space-y-3 pt-6">
                <h3 className="text-lg font-semibold">{s.whatItDoesNotTitle}</h3>
                <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
                  {s.whatItDoesNotItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="text-primary">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <InfoCard title={s.whoItsForTitle} body={s.whoItsForBody} />
            <Card className="border border-amber-300/25 bg-amber-300/10">
              <CardContent className="space-y-3 pt-6">
                <h3 className="text-lg font-semibold text-amber-50">{s.disclaimerTitle}</h3>
                <p className="text-sm leading-7 text-amber-100/90">{s.disclaimerBody}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="surface-panel p-6 sm:p-8" aria-labelledby="tool-title">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 id="tool-title" className="text-2xl font-semibold tracking-tight">
                {s.toolTitle}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{s.toolSubtitle}</p>
            </div>

            <section aria-labelledby="companies-title" className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <h3 id="companies-title" className="text-xl font-semibold">
                    {s.companySectionTitle}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">{s.companySectionHint}</p>
                </div>
                <div className="ml-auto flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedCompanyIds(new Set(companies.map((company) => company.id)))}
                    aria-label={s.ariaSelectAllCompanies}
                  >
                    {s.selectAll}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedCompanyIds(new Set())}
                    aria-label={s.ariaClearCompanies}
                  >
                    {s.clearSelection}
                  </Button>
                </div>
              </div>
              <CompanyGroupList
                lang={lang}
                selectedCompanyIds={selectedCompanyIds}
                onToggleCompany={toggleCompany}
              />
            </section>

            <Separator />

            <section aria-labelledby="rights-title" className="space-y-4">
              <div className="space-y-1">
                <h3 id="rights-title" className="text-xl font-semibold">
                  {s.rightsSectionTitle}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{s.rightsSectionHint}</p>
              </div>
              <fieldset className="grid gap-3">
                {allRequestTypes.map((right) => {
                  const inputId = `right-${right.type}`;
                  const checked = selectedRights.has(right.type);

                  return (
                    <div
                      key={right.type}
                      className={cn(
                        "rounded-2xl border border-border/70 bg-background/35 p-4",
                        checked && "border-primary/70 bg-primary/10"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRight(right.type)}
                          aria-describedby={`${inputId}-description`}
                          className="mt-1 h-5 w-5 rounded border-input bg-background accent-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        />
                        <div className="space-y-1">
                          <Label htmlFor={inputId} className="cursor-pointer text-sm font-semibold">
                            {right.label}
                          </Label>
                          <p id={`${inputId}-description`} className="text-sm leading-6 text-muted-foreground">
                            {right.shortDescription}
                          </p>
                          <p className="text-xs uppercase tracking-wide text-primary">
                            {s.deadlineLabel}: {citations[right.type].responseDeadline}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </fieldset>
            </section>

            <Separator />

            <section aria-labelledby="info-title" className="space-y-4">
              <div className="space-y-1">
                <h3 id="info-title" className="text-xl font-semibold">
                  {s.infoSectionTitle}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{s.infoSectionHint}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sender-name">{s.fullName}</Label>
                  <Input
                    id="sender-name"
                    value={senderName}
                    onChange={(event) => setSenderName(event.target.value)}
                    placeholder={s.fullNamePlaceholder}
                    aria-label={s.fullName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-email">{s.email}</Label>
                  <Input
                    id="sender-email"
                    type="email"
                    value={senderEmail}
                    onChange={(event) => setSenderEmail(event.target.value)}
                    placeholder={s.emailPlaceholder}
                    aria-label={s.email}
                  />
                </div>
              </div>
            </section>

            <Button
              type="button"
              onClick={handleGenerate}
              size="lg"
              disabled={!selectedCompanyIds.size || !selectedRights.size || !senderName.trim() || !senderEmail.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {formatCopy(s.generateFor, { count: Math.max(selectedCompanyIds.size, 1) })}
            </Button>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Card className="border border-border/70 bg-background/40">
              <CardHeader>
                <CardTitle>{s.generatedLetterTitle}</CardTitle>
                <p className="text-sm leading-6 text-muted-foreground">{s.generatedLetterHint}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="generated-letter" className="sr-only">
                  {s.letterPreviewLabel}
                </Label>
                <Textarea
                  id="generated-letter"
                  value={generatedLetter}
                  readOnly
                  placeholder={s.statusReady}
                  className="min-h-[360px] bg-background/70 font-mono text-xs leading-6"
                  aria-live="polite"
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={handleCopy} disabled={!generatedLetter} aria-label={s.ariaCopyLetter}>
                    {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    {copied ? s.copied : s.copy}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleDownload} disabled={!generatedLetter} aria-label={s.ariaDownloadLetter}>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {s.download}
                  </Button>
                  <a
                    href={generatedLetter ? mailtoUrl : undefined}
                    aria-label={s.ariaOpenEmail}
                    className={cn(
                      "focus-outline inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium",
                      generatedLetter && mailtoUrl
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "pointer-events-none bg-muted text-muted-foreground"
                    )}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {s.openEmail}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Alert className="border border-border/70 bg-background/40">
              <AlertTitle>{s.deliveryTitle}</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>{s.deliveryBody}</p>
                <p>{s.bccExplain}</p>
                {companiesWithoutEmail.length > 0 ? (
                  <p>
                    {s.noEmailWarning}{" "}
                    {companiesWithoutEmail.map((company, index) => (
                      <span key={company.id}>
                        <a
                          href={company.privacyUrl ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-outline rounded-sm underline underline-offset-4"
                        >
                          {company.name}
                        </a>
                        {index < companiesWithoutEmail.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                ) : null}
              </AlertDescription>
            </Alert>

            <Card className="border border-emerald-300/25 bg-emerald-400/10">
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-start gap-3">
                  <input
                    id="confirm-sent"
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-input bg-background accent-emerald-400 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="confirm-sent" className="cursor-pointer text-sm font-semibold text-foreground">
                      {s.sentCheckbox}
                    </Label>
                    <p className="text-sm leading-6 text-muted-foreground">{s.sentCheckboxHelp}</p>
                  </div>
                </div>
                {confirmed ? (
                  <Button type="button" onClick={handleConfirmSent} className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400" aria-label={s.ariaStartCountdown}>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    {s.startCountdown}
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border border-border/70 bg-background/35">
      <CardContent className="space-y-3 pt-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm leading-7 text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}
