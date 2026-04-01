import type { Metadata } from "next";
import { Toaster } from "sonner";
import { defaultLang, t } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: t[defaultLang].metaTitle,
  description: t[defaultLang].metaDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLang}
      className="dark h-full antialiased"
    >
      <body className="min-h-full bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          {t[defaultLang].skipToContent}
        </a>
        <div className="flex min-h-full flex-col">{children}</div>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
