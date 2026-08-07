import type { Metadata } from "next";
import { Unbounded, Outfit } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kerbela | Doğruluk Oyunu",
  description:
    "Doğruluk sorularıyla sınırlarını zorla. Hafiften sınır ötesine, kendini test et.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${unbounded.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
