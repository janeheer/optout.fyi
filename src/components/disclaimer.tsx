import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface DisclaimerProps {
  lang: Lang;
}

export function Disclaimer({ lang }: DisclaimerProps) {
  const s = t[lang];

  return (
    <Alert className="border-amber-300/25 bg-amber-300/10 text-amber-50">
      <Info className="h-4 w-4 text-amber-200" aria-hidden="true" />
      <AlertTitle className="text-amber-50">{s.disclaimerTitle}</AlertTitle>
      <AlertDescription className="text-amber-100/90">
        {s.disclaimerBody}
      </AlertDescription>
    </Alert>
  );
}
