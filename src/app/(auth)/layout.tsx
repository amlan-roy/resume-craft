import Footer from "@/components/global/Footer";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

type AuthPagesLayoutProps = {
  children: React.ReactNode;
};

const AuthPagesLayout: React.FC<AuthPagesLayoutProps> = ({ children }) => {
  return (
    <>
      <AuthenticatedHeader hideLogout />
      <main className="flex-grow">
        {children}
        <Toaster />
      </main>
      <Footer />
    </>
  );
};
export default AuthPagesLayout;
