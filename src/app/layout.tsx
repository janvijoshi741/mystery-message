import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import AuthProvider from "@/context/AuthProvider";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "Send Mystery Messages to your loved ones.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {/* <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          > */}
          <Navbar />
          {children}
          <Toaster />
          {/* </div> */}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
