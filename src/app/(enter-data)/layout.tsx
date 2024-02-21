import Footer from "@/components/global/Footer";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import React from "react";

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
