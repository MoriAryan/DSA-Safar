import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopRightHeader } from "@/components/TopRightHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Striver's A2Z DSA Course/Sheet",
  description: "Offline tracker for Striver's A2Z DSA Sheet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-inter flex h-screen overflow-hidden bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <TopRightHeader />
              <main className="flex-1 overflow-y-auto relative bg-white dark:bg-[#0c0c0e]">
                {children}
              </main>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
