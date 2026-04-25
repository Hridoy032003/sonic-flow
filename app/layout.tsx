import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";

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
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ThemeToggle />
        </AuthProvider>
      </body>
    </html>
  );
}
