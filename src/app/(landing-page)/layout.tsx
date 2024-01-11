import Header from "@/components/landing-page/Header";
import React from "react";

type HomePageLayoutProps = {
  children: React.ReactNode;
};

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
};
export default HomePageLayout;
