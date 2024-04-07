import React from "react";
import { Toaster } from "@/components/ui/toaster";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import Footer from "@/components/global/Footer";

type AuthPagesLayoutProps = {
  children: React.ReactNode;
};

const AuthPagesLayout: React.FC<AuthPagesLayoutProps> = async ({
  children,
}) => {
  return (
    <>
      <AuthenticatedHeader hideLogout />
      <main className="flex-grow flex flex-col">
        {children}
        <Toaster />
      </main>
    </>
  );
};
export default AuthPagesLayout;
