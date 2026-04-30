import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthLoadingHandler from "@/components/AuthLoadingHandler";

import { SettingsProvider } from "@/components/SettingsProvider";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "SonicFlow - Premium Music",
  description: "Download and listen to your favorite music offline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-500 font-sans">
        <SettingsProvider>
          <AuthProvider>
            <AuthLoadingHandler>
              <div className="px-2 md:px-16 lg:px-24 xl:px-48">
                <Navbar />
                <main className="flex-1 w-full max-w-[1900px] mx-auto px-3 md:px-8 lg:px-12 xl:px-24">{children}</main>
                <Footer />
              </div>
            </AuthLoadingHandler>
            <Toaster position="top-right" />
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
