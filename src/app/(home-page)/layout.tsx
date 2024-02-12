import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import React from "react";

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
