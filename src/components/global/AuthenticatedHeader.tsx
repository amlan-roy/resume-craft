"use client";

import React from "react";
import { sendEmailVerification } from "firebase/auth";
import { CircleUserRoundIcon } from "lucide-react";
import { useTheme } from "next-themes";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/utils/firebase/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import LogoutButton from "@/components/auth/LogoutButton";
import Logo from "@/components/global/Logo";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import EmailVerificationBanner from "./EmailVerificationBanner";

const ThemeSwitch = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();
  return (
    <div className={cn(["flex gap-6 items-center", className])}>
      <Switch
        id="dark-mode"
        checked={theme === "dark"}
        onCheckedChange={() => {
          theme === "dark" ? setTheme("light") : setTheme("dark");
        }}
      />
      <Label htmlFor="dark-mode">Dark Mode</Label>
    </div>
  );
};

type AuthenticatedHeaderProps = {
  hideLogout?: boolean;
  isEmailVerified?: boolean;
};

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({
  hideLogout,
}) => {
  const [displayEmailVerificationBanner, setDisplayEmailVerificationBanner] =
    React.useState(!!!auth.currentUser?.emailVerified);

  const { toast: displayToast } = useToast();

  const [lastAuthRequestSent, setLastAuthRequestSent] = useLocalStorage(
    `${auth.currentUser?.uid}-last-auth-request-sent`
  );

  const resendVerificationEmail = async () => {
    try {
      if (
        lastAuthRequestSent &&
        Date.now() - parseInt(lastAuthRequestSent) < 60000
      ) {
        displayToast({
          title: "Wait a minute!",
          description: "Please wait before sending another email.",
          variant: "destructive",
        });
        return;
      }
      if (auth.currentUser && !auth.currentUser?.emailVerified) {
        await sendEmailVerification(auth.currentUser);
        setLastAuthRequestSent(Date.now().toString());
        displayToast({
          title: "Email sent!",
          description: "Please check your inbox for the verification email.",
          variant: "default",
        });
      }
    } catch (error) {
      displayToast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {displayEmailVerificationBanner && (
        <EmailVerificationBanner
          onDismiss={() => {
            setDisplayEmailVerificationBanner(false);
          }}
        />
      )}
      <header
        data-testid="global__header"
        className="p-4 w-full flex justify-between mx-auto max-w-screen-xl"
      >
        <Logo linkify />
        <div className="flex items-center">
          {!hideLogout ? (
            <DropdownMenu>
              <DropdownMenuTrigger title="See More" className="p-4">
                <CircleUserRoundIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4 p-4">
                <div className="text-brand-neutral-9 text-base font-semibold">
                  Hi {auth.currentUser?.displayName || "there"}!
                </div>
                <DropdownMenuSeparator className="my-4" />
                <ThemeSwitch />
                {!!!auth.currentUser?.emailVerified && (
                  <>
                    <DropdownMenuSeparator className="my-4" />
                    <Button
                      variant={"outline"}
                      onClick={resendVerificationEmail}
                      className="w-full"
                    >
                      Resend Verification Email
                    </Button>
                  </>
                )}
                <DropdownMenuSeparator className="my-4" />
                <LogoutButton buttonClass="w-full" />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <ThemeSwitch />
          )}
        </div>
      </header>
    </>
  );
};
export default AuthenticatedHeader;
