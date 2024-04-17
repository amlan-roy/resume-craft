import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/components/theme-provider";
import { UserDataStoreProvider } from "@/components/providers/user-data-store-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Craft: Your Custom Resume Solution",
  description:
    "Resume Craft: Your go-to platform for effortlessly tailoring ATS-friendly resumes to job descriptions. Streamline your job application process and stand out in the competitive market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(inter.className, "min-h-screen flex flex-col")}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <UserDataStoreProvider>{children}</UserDataStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
