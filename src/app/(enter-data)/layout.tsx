import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import React from "react";

type EnterDataPageLayoutProps = {
  children: React.ReactNode;
};

const EnterDataPageLayout: React.FC<EnterDataPageLayoutProps> = ({
  children,
}) => {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
};
export default EnterDataPageLayout;
