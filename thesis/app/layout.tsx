import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { EdgeStoreProvider } from '../lib/edgestore';
import { Toaster } from "@/components/ui/sonner"
import { DoctorsProvider } from "@/context/DoctorsContext";



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
  title: "Healthcare Management System",
  description: "A comprehensive healthcare management system for booking appointments and managing doctor profiles.",
  keywords: "healthcare, appointments, doctors, medical, booking, health management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <EdgeStoreProvider>
            <DoctorsProvider>
              <Toaster richColors position="top-right" />

              {children}
            </DoctorsProvider>
          </EdgeStoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
