"use client";

import React from "react";
import { CircleUserRoundIcon } from "lucide-react";
import { useTheme } from "next-themes";
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
};

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({
  hideLogout,
}) => {
  return (
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
              <ThemeSwitch className="mb-4" />
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <ThemeSwitch />
        )}
      </div>
    </header>
  );
};
export default AuthenticatedHeader;
