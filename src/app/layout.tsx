import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qurbani Eid Experience 2026 | ঈদ-উল-আযহা মুবারক",
  description:
    "একটি বিশেষ ঈদ-উল-আযহা অভিজ্ঞতা — আপনার প্রিয়জনদের জন্য একটি ব্যক্তিগত শুভেচ্ছা তৈরি করুন।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
