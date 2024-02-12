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
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
};
export default EnterDataPageLayout;
