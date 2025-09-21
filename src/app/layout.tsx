import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

import logo from "@/app/DigiBuzz-icon.png";
import QueryProviders from "./components/QueryProvider";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DigitalBuzz - Task Management System",
  description: "Real Estate Marketing Agency Task Coordination System",
  icons: {
    icon: "/digitalbuzz.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <QueryProviders>
            <Toaster position="bottom-right" />
            {children}
            <Footer />
          </QueryProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
