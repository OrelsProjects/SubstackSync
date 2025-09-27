import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionWrapper from "@/app/providers/SessionWrapper";
import StoreProvider from "@/app/providers/StoreProvider";
import { ToastProvider } from "@/app/providers/ToastProvider";
import { Suspense } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SequenceStack",
  description: "SequenceStack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <StoreProvider>
            <ToastProvider />
            <SessionWrapper>{children}</SessionWrapper>
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
