import Footer from "@/components/global/Footer";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import React from "react";

type GenerateResumePageLayoutProps = {
  children: React.ReactNode;
};

const GenerateResumePageLayout: React.FC<GenerateResumePageLayoutProps> = ({
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
export default GenerateResumePageLayout;
