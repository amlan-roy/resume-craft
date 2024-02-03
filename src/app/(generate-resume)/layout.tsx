import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import React from "react";

type GenerateResumePageLayoutProps = {
  children: React.ReactNode;
};

const GenerateResumePageLayout: React.FC<GenerateResumePageLayoutProps> = ({
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
export default GenerateResumePageLayout;
