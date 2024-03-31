import React from "react";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import Footer from "@/components/global/Footer";

type MyResumesPageLayoutProps = {
  children: React.ReactNode;
};

const MyResumesPageLayout: React.FC<MyResumesPageLayoutProps> = ({
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
export default MyResumesPageLayout;
