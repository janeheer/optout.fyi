import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { companyGroups, companySpanishNotes, formatCopy, t, type Lang } from "@/lib/i18n";
import { companies } from "@/legal/companies";
import { cn } from "@/lib/utils";

interface CompanyGroupListProps {
  lang: Lang;
  selectedCompanyIds: Set<string>;
  onToggleCompany: (id: string) => void;
}

export function CompanyGroupList({
  lang,
  selectedCompanyIds,
  onToggleCompany,
}: CompanyGroupListProps) {
  const s = t[lang];

  return (
    <div className="space-y-5">
      {companyGroups.map((group) => {
        const groupIds = new Set<string>(group.ids);
        const groupCompanies = companies.filter((company) => groupIds.has(company.id));
        const titleKey =
          group.key === "surveillance"
            ? "companyGroupSurveillance"
            : group.key === "dataBrokers"
              ? "companyGroupDataBrokers"
              : group.key === "platforms"
                ? "companyGroupPlatforms"
                : "companyGroupTelecom";
        const hintKey =
          group.key === "surveillance"
            ? "companyGroupSurveillanceHint"
            : group.key === "dataBrokers"
              ? "companyGroupDataBrokersHint"
              : group.key === "platforms"
                ? "companyGroupPlatformsHint"
                : "companyGroupTelecomHint";

        return (
          <fieldset key={group.key} className="space-y-3">
            <legend className="text-base font-semibold text-foreground">
              {s[titleKey]}
            </legend>
            <p className="text-sm text-muted-foreground">{s[hintKey]}</p>
            <div className="grid gap-3">
              {groupCompanies.map((company) => {
                const inputId = `company-${company.id}`;
                const checked = selectedCompanyIds.has(company.id);

                return (
                  <div
                    key={company.id}
                    className={cn(
                      "rounded-2xl border border-border/70 bg-background/35 p-4 transition-colors",
                      checked && "border-primary/70 bg-primary/10"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleCompany(company.id)}
                        aria-describedby={`${inputId}-description`}
                        className="mt-1 h-5 w-5 rounded border-input bg-background accent-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Label
                          htmlFor={inputId}
                          className="cursor-pointer items-start justify-between gap-3 text-left"
                        >
                          <span className="space-y-1">
                            <span className="block text-sm font-semibold text-foreground">
                              {company.name}
                            </span>
                            <span
                              id={`${inputId}-description`}
                              className="block text-sm leading-6 text-muted-foreground"
                            >
                              {company.description}
                            </span>
                          </span>
                          {company.privacyEmail ? (
                            <Badge variant="outline" className="shrink-0 border-border/70 bg-card/40">
                              {company.privacyEmail}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="shrink-0 border-amber-300/30 bg-amber-300/10 text-amber-100"
                            >
                              {s.noEmailShort}
                            </Badge>
                          )}
                        </Label>
                        {lang === "es" && companySpanishNotes[company.id] ? (
                          <p className="text-sm text-emerald-100/80">
                            {companySpanishNotes[company.id]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        );
      })}
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {selectedCompanyIds.size === 1
          ? formatCopy(s.companySelectedCount, { count: selectedCompanyIds.size })
          : formatCopy(s.companySelectedCountPlural, { count: selectedCompanyIds.size })}
      </p>
    </div>
  );
}
