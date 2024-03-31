import React from "react";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import Footer from "@/components/global/Footer";

type HomePageLayoutProps = {
  children: React.ReactNode;
};

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <>
      <AuthenticatedHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
};
export default HomePageLayout;
