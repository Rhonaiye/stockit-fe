import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/context/app-context";
import { Toaster } from "sonner";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StockIt - Inventory Management That Pays For Itself",
  description: "Stop losing money to stockouts and overstocking. StockIt gives you real-time control over every product, every branch, every sale. Trusted by 2,000+ Nigerian businesses.",
  keywords: ["inventory management", "stock tracking", "POS", "multi-branch", "SaaS", "Nigeria", "business software"],
  openGraph: {
    title: "StockIt - Inventory Management That Pays For Itself",
    description: "Real-time inventory control for growing businesses. Track stock, manage sales, and run reports across all your branches.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <LoadingOverlay />
            {children}
            <Toaster position="bottom-center" richColors closeButton toastOptions={{
              className: "w-fit max-w-[320px] !rounded-2xl !border-border !bg-card/90 !backdrop-blur-md !text-foreground font-inter shadow-2xl !py-4 !px-6",
            }} />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
