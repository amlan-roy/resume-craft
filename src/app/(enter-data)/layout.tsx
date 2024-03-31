import React from "react";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import Footer from "@/components/global/Footer";

type EnterDataPageLayoutProps = {
  children: React.ReactNode;
};

const EnterDataPageLayout: React.FC<EnterDataPageLayoutProps> = ({
  children,
}) => {
  return (
    <>
      <AuthenticatedHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
};
export default EnterDataPageLayout;
