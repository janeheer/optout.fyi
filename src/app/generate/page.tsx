"use client";

import { startTransition, useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeCountdown } from "@/components/home-countdown";
import { HomeGenerator } from "@/components/home-generator";
import { defaultLang, type Lang } from "@/lib/i18n";
import { getSentRecord, type SentRecord } from "@/lib/tracking";

export default function GeneratePage() {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [sentRecord, setSentRecord] = useState<SentRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const nextSentRecord = getSentRecord();
    startTransition(() => {
      setSentRecord(nextSentRecord);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <>
      <Header lang={lang} onToggleLanguage={() => setLang(lang === "es" ? "en" : "es")} />
      <main id="main-content" className="flex-1">
        {sentRecord ? (
          <HomeCountdown lang={lang} sentRecord={sentRecord} onReset={() => setSentRecord(null)} />
        ) : (
          <HomeGenerator lang={lang} onStartCountdown={() => setSentRecord(getSentRecord())} />
        )}
      </main>
      <Footer lang={lang} />
    </>
  );
}
