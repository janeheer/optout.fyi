"use client";

import { startTransition, useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeCountdown } from "@/components/home-countdown";
import { HomeGenerator } from "@/components/home-generator";
import { HomeLanguageGate } from "@/components/home-language-gate";
import { type Lang } from "@/lib/i18n";
import { getSentRecord, type SentRecord } from "@/lib/tracking";

export default function Home() {
  const [lang, setLang] = useState<Lang | null>(null);
  const [sentRecord, setSentRecord] = useState<SentRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const nextSentRecord = getSentRecord();
    startTransition(() => {
      setSentRecord(nextSentRecord);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  if (!lang) {
    return <HomeLanguageGate onSelectLanguage={setLang} />;
  }

  return (
    <>
      <Header lang={lang} onToggleLanguage={() => setLang(lang === "es" ? "en" : "es")} />
      <main id="main-content" className="flex-1">
        {sentRecord ? (
          <HomeCountdown lang={lang} sentRecord={sentRecord} onReset={() => setSentRecord(null)} />
        ) : (
          <HomeGenerator
            lang={lang}
            onStartCountdown={() => setSentRecord(getSentRecord())}
          />
        )}
      </main>
      <Footer lang={lang} />
    </>
  );
}
