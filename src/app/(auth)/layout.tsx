import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import React from "react";

type AuthPagesLayoutProps = {
  children: React.ReactNode;
};

const AuthPagesLayout: React.FC<AuthPagesLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
};
export default AuthPagesLayout;
