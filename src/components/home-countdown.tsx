"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { companies } from "@/legal/companies";
import { type RequestType } from "@/legal/citations";
import { generateComplaintLetter } from "@/legal/templates";
import { formatCopy, t, type Lang } from "@/lib/i18n";
import { clearSentRecord, getDaysRemaining, type SentRecord } from "@/lib/tracking";
import { cn } from "@/lib/utils";

interface HomeCountdownProps {
  lang: Lang;
  sentRecord: SentRecord;
  onReset: () => void;
}

export function HomeCountdown({ lang, sentRecord, onReset }: HomeCountdownProps) {
  const s = t[lang];
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [overdueCompanyIds, setOverdueCompanyIds] = useState<Set<string>>(new Set());
  const [complaintLetter, setComplaintLetter] = useState("");
  const [complaintCopied, setComplaintCopied] = useState(false);

  const sentCompanies = companies.filter((company) => sentRecord.companyIds.includes(company.id));
  const daysLeft = getDaysRemaining(sentRecord.sentDate, sentRecord.requestTypes);
  const isOverdue = daysLeft < 0;
  const sentDate = new Date(sentRecord.sentDate);
  const deadlineWindowDays =
    sentRecord.requestTypes.length > 0
      ? Math.max(
          ...sentRecord.requestTypes.map((requestType) =>
            requestType === "OPT_OUT_SALE" || requestType === "LIMIT_SENSITIVE" ? 15 : 45
          )
        )
      : 45;
  const deadlineDate = new Date(sentDate.getTime() + deadlineWindowDays * 24 * 60 * 60 * 1000);
  const locale = lang === "es" ? "es-US" : "en-US";

  const handleGenerateComplaint = () => {
    if (!overdueCompanyIds.size || !senderName.trim() || !senderEmail.trim()) return;

    const rights = ["RIGHT_TO_DELETE", "OPT_OUT_SALE"] as RequestType[];
    const letters = companies
      .filter((company) => overdueCompanyIds.has(company.id))
      .map((company) =>
        generateComplaintLetter(
          {
            senderName: senderName.trim(),
            senderEmail: senderEmail.trim(),
            company,
            requestTypes: rights,
          },
          sentDate
        )
      );

    setComplaintLetter(letters.join("\n\n" + "=".repeat(60) + "\n\n"));
  };

  const handleCopyComplaint = async () => {
    await navigator.clipboard.writeText(complaintLetter);
    setComplaintCopied(true);
    toast.success(s.copied);
    setTimeout(() => setComplaintCopied(false), 2000);
  };

  const handleDownloadComplaint = () => {
    const blob = new Blob([complaintLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "optout-complaint.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    clearSentRecord();
    onReset();
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:py-8">
      <div className="sr-only" aria-live="polite">
        {complaintLetter ? s.statusComplaintGenerated : s.countdownHelp}
      </div>

      <section className="surface-panel p-6 sm:p-8" aria-labelledby="deadline-title">
        <div className="max-w-3xl space-y-6">
          <div className="space-y-3">
            <Badge className="bg-primary text-primary-foreground">{s.countdownTitle}</Badge>
            <h1 id="deadline-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {isOverdue ? s.overdueTitle : s.countdownTitle}
            </h1>
            <p className="text-base leading-7 text-muted-foreground">{s.countdownHelp}</p>
          </div>

          {isOverdue ? (
            <Alert className="border-destructive/35 bg-destructive/12" role="status">
              <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
              <AlertTitle>{s.overdueTitle}</AlertTitle>
              <AlertDescription>{formatCopy(s.overdueBody, { count: Math.abs(daysLeft) })}</AlertDescription>
            </Alert>
          ) : (
            <Card className="border border-border/70 bg-background/35">
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2 text-center" aria-live="polite">
                  <Clock className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
                  <p className="text-5xl font-semibold tabular-nums text-foreground">{daysLeft}</p>
                  <p className="text-base text-muted-foreground">
                    {daysLeft === 1
                      ? formatCopy(s.countdownDayLeft, { count: daysLeft })
                      : formatCopy(s.countdownDaysLeft, { count: daysLeft })}
                  </p>
                </div>
                <div
                  className="h-3 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label={s.countdownTitle}
                  aria-valuemin={0}
                  aria-valuemax={45}
                  aria-valuenow={Math.max(0, Math.min(45, 45 - daysLeft))}
                >
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      daysLeft <= 5 ? "bg-destructive" : daysLeft <= 15 ? "bg-amber-400" : "bg-primary"
                    )}
                    style={{ width: `${Math.max(0, Math.min(100, ((45 - daysLeft) / 45) * 100))}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground" aria-live="polite">
            <Badge variant="outline" className="border-border/70 bg-card/50">
              {s.countdownSentOn}:{" "}
              {sentDate.toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" })}
            </Badge>
            <Badge variant="outline" className="border-border/70 bg-card/50">
              {s.countdownDeadline}:{" "}
              {deadlineDate.toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" })}
            </Badge>
          </div>

          <section aria-labelledby="notified-title" className="space-y-3">
            <h2 id="notified-title" className="text-xl font-semibold">
              {s.companiesNotified}
            </h2>
            <div className="flex flex-wrap gap-2">
              {sentCompanies.map((company) => (
                <Badge key={company.id} variant="outline" className="border-border/70 bg-card/50 px-3 py-1">
                  {company.name}
                </Badge>
              ))}
            </div>
          </section>

          {isOverdue ? (
            <section aria-labelledby="overdue-title" className="space-y-4">
              <div>
                <h2 id="overdue-title" className="text-xl font-semibold">
                  {s.overdueSectionTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.overdueSectionHint}</p>
              </div>
              <div className="grid gap-3">
                {sentCompanies.map((company) => {
                  const inputId = `overdue-${company.id}`;
                  const checked = overdueCompanyIds.has(company.id);

                  return (
                    <div
                      key={company.id}
                      className={cn(
                        "rounded-2xl border border-border/70 bg-background/35 p-4",
                        checked && "border-destructive/60 bg-destructive/10"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setOverdueCompanyIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(company.id)) next.delete(company.id);
                              else next.add(company.id);
                              return next;
                            })
                          }
                          className="mt-1 h-5 w-5 rounded border-input bg-background accent-[var(--color-destructive)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        />
                        <div className="space-y-1">
                          <Label htmlFor={inputId} className="cursor-pointer text-sm font-semibold">
                            {company.name}
                          </Label>
                          {company.privacyEmail ? (
                            <p className="text-sm text-muted-foreground">{company.privacyEmail}</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {overdueCompanyIds.size > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="complaint-name">{s.fullName}</Label>
                    <Input
                      id="complaint-name"
                      value={senderName}
                      onChange={(event) => setSenderName(event.target.value)}
                      placeholder={s.fullNamePlaceholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complaint-email">{s.email}</Label>
                    <Input
                      id="complaint-email"
                      type="email"
                      value={senderEmail}
                      onChange={(event) => setSenderEmail(event.target.value)}
                      placeholder={s.emailPlaceholder}
                    />
                  </div>
                </div>
              ) : null}

              {overdueCompanyIds.size > 0 ? (
                <Button type="button" onClick={handleGenerateComplaint} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  {s.generateComplaint}
                </Button>
              ) : null}

              {complaintLetter ? (
                <Card className="border border-destructive/35 bg-destructive/10" aria-live="polite">
                  <CardHeader>
                    <CardTitle>{s.complaintTitle}</CardTitle>
                    <p className="text-sm leading-6 text-muted-foreground">{s.complaintHint}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      id="complaint-preview"
                      readOnly
                      value={complaintLetter}
                      className="min-h-[280px] bg-background/70 font-mono text-xs leading-6"
                      aria-live="polite"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={handleCopyComplaint} aria-label={s.ariaCopyComplaint}>
                        {complaintCopied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                        {complaintCopied ? s.copied : s.copy}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleDownloadComplaint} aria-label={s.ariaDownloadComplaint}>
                        <Download className="h-4 w-4" aria-hidden="true" />
                        {s.download}
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <a
                        href="https://cppa.ca.gov/webapplications/complaint"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-outline rounded-2xl border border-border/70 bg-background/40 p-4 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                      >
                        <span className="flex items-center gap-2 font-semibold text-foreground">
                          <ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" />
                          {s.fileCPPA}
                        </span>
                        <span className="mt-2 block">{s.fileCPPANote}</span>
                      </a>
                      <a
                        href="https://oag.ca.gov/contact/consumer-complaint-against-business-or-company"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-outline rounded-2xl border border-border/70 bg-background/40 p-4 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                      >
                        <span className="flex items-center gap-2 font-semibold text-foreground">
                          <ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" />
                          {s.fileAG}
                        </span>
                        <span className="mt-2 block">{s.fileAGNote}</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </section>
          ) : null}

          <Button type="button" variant="ghost" onClick={handleReset} aria-label={s.ariaStartOver} className="w-fit">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {s.startOver}
          </Button>
        </div>
      </section>
    </div>
  );
}
