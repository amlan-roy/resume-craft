import React from "react";
import Footer from "@/components/global/Footer";
import Header from "@/components/landing-page/Header";

type HomePageLayoutProps = {
  children: React.ReactNode;
};

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
};
export default HomePageLayout;
