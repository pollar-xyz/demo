import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { Shell } from "@/app/Shell";
import { NekoGateProvider } from "@/app/neko/_GateProvider";
import { AcceslyGateProvider } from "@/app/accesly/_GateProvider";
import { LanguageProvider } from "@/app/_i18n/LanguageProvider";
import { resolveLocale } from "@/app/_i18n/locale";
import { NEKO_COOKIE, NEKO_COOKIE_VALUE } from "@/app/neko/_gate";
import { ACCESLY_COOKIE, ACCESLY_COOKIE_VALUE } from "@/app/accesly/_gate";
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
  const cookieStore = await cookies();
  const nekoUnlocked =
    cookieStore.get(NEKO_COOKIE)?.value === NEKO_COOKIE_VALUE;
  const acceslyUnlocked =
    cookieStore.get(ACCESLY_COOKIE)?.value === ACCESLY_COOKIE_VALUE;

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
            <AcceslyGateProvider unlocked={acceslyUnlocked}>
              <Suspense>
                <Shell>{children}</Shell>
              </Suspense>
            </AcceslyGateProvider>
          </NekoGateProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
