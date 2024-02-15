import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/components/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from "@/components/react-login/GoogleLoginButton.client";

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
          <GoogleOAuthProvider clientId="1059288678634-b28p0vk81r6buvuihbb7be82233n49ju.apps.googleusercontent.com">
            {children}
            <div>
              <GoogleLoginButton />
            </div>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
