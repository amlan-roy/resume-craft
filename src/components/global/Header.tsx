"use client";
import React from "react";
import Logo from "@/components/global/Logo";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const { setTheme, theme } = useTheme();
  return (
    <header className="p-4 w-full flex justify-between mx-auto max-w-screen-xl">
      <Logo linkify />
      <div className="flex items-center space-x-2 mx-2">
        <Switch
          id="dark-mode"
          checked={theme === "dark"}
          onCheckedChange={() => {
            theme === "dark" ? setTheme("light") : setTheme("dark");
          }}
        />
        <Label htmlFor="dark-mode">Dark Mode</Label>
      </div>
    </header>
  );
};
export default Header;
