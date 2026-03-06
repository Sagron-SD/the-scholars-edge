import "./globals.css";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AuthGuard } from "@/components/auth-guard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "The Scholars Edge",
  description: "Academic success, wellness, and momentum coaching platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
