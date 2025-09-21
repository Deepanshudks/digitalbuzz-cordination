import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

import QueryProviders from "./components/QueryProvider";
import Footer from "./components/Footer";

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
