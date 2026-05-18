import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "mo7assib",
  description: "منصة مهنية لتدبير دورة حياة أوراش البناء للمطورين العقاريين بالمغرب",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar-MA" dir="rtl">
      <body className={`${tajawal.variable} font-sans`}>{children}</body>
    </html>
  );
}
