import React from "react";
import AuthenticatedHeader from "@/components/global/AuthenticatedHeader";
import Footer from "@/components/global/Footer";
import BoxLoader from "@/components/loading/BoxLoader";

type LoadingPageProps = {
  children: React.ReactNode;
};

const LoadingPage: React.FC<LoadingPageProps> = ({}) => {
  return (
    <>
      <div className="flex-grow flex w-full h-full justify-center items-center mt-9">
        <BoxLoader className="w-20 h-20 mx-auto my-auto" />
      </div>
    </>
  );
};
export default LoadingPage;
