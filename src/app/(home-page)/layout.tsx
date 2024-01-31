import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import React from "react";

type HomePageLayoutProps = {
  children: React.ReactNode;
};

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen">
      <Header />
      {children}
      <Footer />
    </main>
  );
};
export default HomePageLayout;
