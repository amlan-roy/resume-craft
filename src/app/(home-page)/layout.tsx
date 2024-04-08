import React from "react";
import { auth } from "@/lib/utils/firebase/config";
import { Toaster } from "@/components/ui/toaster";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import Footer from "@/components/global/Footer";

type HomePageLayoutProps = {
  children: React.ReactNode;
};

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <>
      <AuthenticatedHeader
        isEmailVerified={!!auth.currentUser?.emailVerified}
      />
      <main className="flex-grow">
        {children}
        <Toaster />
      </main>
      <Footer />
    </>
  );
};
export default HomePageLayout;
