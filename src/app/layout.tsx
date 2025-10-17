import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "Atlas Earth Hub - Optimize Your Virtual Real Estate",
  description: "Comprehensive tools for Atlas Earth players including ROI calculators, strategy planning, and portfolio tracking with verified game data.",
  keywords: "Atlas Earth, ROI calculator, virtual real estate, strategy planner, portfolio tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <ThemeProvider
            defaultTheme="light"
            storageKey="atlas-earth-theme"
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}