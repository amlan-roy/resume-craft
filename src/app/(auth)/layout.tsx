import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/global/Header";

type AuthPagesLayoutProps = {
  children: React.ReactNode;
};

const AuthPagesLayout: React.FC<AuthPagesLayoutProps> = async ({
  children,
}) => {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">
        {children}
        <Toaster />
      </main>
    </>
  );
};
export default AuthPagesLayout;
