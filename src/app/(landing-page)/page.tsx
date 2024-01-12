import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import a from "../../../public/resume-illustration.png";

type LandingPageProps = {};

const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <>
      <section className="overflow-hidden px-4 sm:px-6 mt-10 sm:flex md:justify-center md:items-end md:mx-12">
        <div className="flex flex-col w-full max-w-2xl">
          <h1 className="md:text-6xl text-5xl font-bold text-brand-neutral-11">
            Welcome to Resume Cart
          </h1>
          <div className="w-full justify-center items-center relative flex md:hidden mt-8">
            <Image
              src={"/resume-illustration.png"}
              width={340}
              height={275}
              alt={"Resume illustration"}
            />
          </div>
          <h5 className="md:text-2xl text-base text-brand-neutral-8 mt-14">
            Enter the data that will be filled in your resume. The data entered
            here will later be modified for the different job descriptions that
            you will provide.
          </h5>
          <Button
            variant={"default"}
            className="md:text-4xl text-xl py-7 px-7 w-fit mt-9 md:mx-0 mx-auto"
          >
            Get Started
          </Button>
        </div>
        <div className="justify-center items-center hidden md:flex">
          <Image
            src={"/resume-illustration.png"}
            width={515}
            height={416}
            alt={"Resume illustration"}
          />
        </div>
      </section>
    </>
  );
};
export default LandingPage;
