import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { getCurrentUser } from "@/lib/supabase/server";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Splits · Training Analysis",
  description: "App de análisis deportivo para atletas de resistencia",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const me = await getCurrentUser();
  const authUser = me
    ? {
        id: me.id,
        email: me.email ?? "",
        name: ((me.user_metadata?.name as string) ?? me.email ?? "").toString(),
      }
    : null;
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${jetbrains.variable} h-full antialiased`}
      data-theme="oscuro"
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider user={authUser}>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
