import React from "react";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import Footer from "@/components/global/Footer";

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
