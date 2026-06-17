import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { Shell } from "@/app/Shell";
import { NekoGateProvider } from "@/app/_neko/NekoGateProvider";
import { LanguageProvider } from "@/app/_i18n/LanguageProvider";
import { resolveLocale } from "@/app/_i18n/locale";
import { NEKO_COOKIE, NEKO_COOKIE_VALUE } from "@/lib/neko-gate";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pollar SDK demo",
  description: "Pollar embedded wallet demo",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await resolveLocale();
  const nekoUnlocked =
    (await cookies()).get(NEKO_COOKIE)?.value === NEKO_COOKIE_VALUE;
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('pollar-demo-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider initialLocale={locale}>
          <NekoGateProvider unlocked={nekoUnlocked}>
            <Suspense>
              <Shell>{children}</Shell>
            </Suspense>
          </NekoGateProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
