import React from "react";
import { Toaster } from "@/components/ui/toaster";
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
      <main className="flex-grow flex flex-col">
        {children}
        <Toaster />
      </main>
      <Footer />
    </>
  );
};
export default MyResumesPageLayout;
