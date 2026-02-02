import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schalk Griebenow Portfolio",
  description: "Schalk Griebenow Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
