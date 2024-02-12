import React from "react";
import Footer from "@/components/global/Footer";
import Header from "@/components/landing-page/Header";

type HomePageLayoutProps = {
  children: React.ReactNode;
};

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
};
export default HomePageLayout;
