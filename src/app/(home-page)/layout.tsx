import Footer from "@/components/global/Footer";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import React from "react";

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
