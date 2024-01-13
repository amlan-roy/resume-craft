import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRegClock, FaRegFileAlt, FaCodeBranch } from "react-icons/fa";

type LandingPageProps = {};

const FeaturesCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="w-72">
      <div className="z-20 flex justify-center items-center rounded-full md:w-16 md:h-16 w-10 h-10 bg-brand-primary-green-10 text-brand-neutral-2 relative top-5 md:left-[calc(50%-32px)] left-[calc(50%-20px)]">
        {icon}
      </div>
      <Card className="p-2 bg-brand-secondary-blue-4 md:min-h-72 min-h-64">
        <CardHeader>
          <CardTitle className="text-center text-brand-primary-green-10 md:text-2xl text-xl font-bold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-primary-green-8 text-base">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <>
      <section className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 sm:flex md:justify-center md:items-end items-center md:mx-auto mx-6">
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
      <section className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-24 sm:flex sm:flex-col md:justify-center md:items-start items-center md:mx-auto mx-6">
        <h2 className="md:text-5xl text-4xl font-bold text-brand-neutral-11 mx-auto text-center">
          How It Works
        </h2>
        <div className="flex gap-5 mt-6">
          <div className="flex justify-center items-center rounded-full md:w-16 md:h-16 w-10 h-10 bg-brand-primary-brown-4 md:text-4xl text-3xl text-brand-secondary-blue-10 font-bold p-6 md:p-8">
            1
          </div>
          <div>
            <h3 className="md:text-3xl text-2xl text-brand-primary-brown-10 font-bold">
              One-Time Resume Input
            </h3>
            <p className="md:text-xl text-base text-brand-neutral-9">
              Input your resume details just once. We store your information in
              your browser for future use. Your information is not shared with
              any third party.
            </p>
          </div>
        </div>
        <div className="flex gap-5 mt-6">
          <div className="flex justify-center items-center rounded-full md:w-16 md:h-16 w-10 h-10 bg-brand-primary-brown-4 md:text-4xl text-3xl text-brand-secondary-blue-10 font-bold p-6 md:p-8">
            2
          </div>
          <div>
            <h3 className="md:text-3xl text-2xl text-brand-primary-brown-10 font-bold">
              Job Description Integration
            </h3>
            <p className="md:text-xl text-base text-brand-neutral-9">
              Provide the job description for the position you're targeting. Our
              intelligent system generates a custom ChatGPT prompt just for you.
            </p>
          </div>
        </div>
        <div className="flex gap-5 mt-6">
          <div className="flex justify-center items-center rounded-full md:w-16 md:h-16 w-10 h-10 bg-brand-primary-brown-4 md:text-4xl text-3xl text-brand-secondary-blue-10 font-bold p-6 md:p-8">
            3
          </div>
          <div>
            <h3 className="md:text-3xl text-2xl text-brand-primary-brown-10 font-bold">
              Generate Your Custom Resume
            </h3>
            <p className="md:text-xl text-base text-brand-neutral-9">
              Copy and paste the ChatGPT response into the app. Watch as Resume
              Craft transforms it into a tailor-made, ATS-friendly resume.
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-24 sm:flex sm:flex-col md:justify-center md:items-start items-center md:mx-auto mx-6">
        <h2 className="md:text-5xl text-4xl font-bold text-brand-neutral-11 mx-auto text-center">
          Key Features
        </h2>
        <h5 className="md:text-2xl text-base text-brand-neutral-8 mt-6 text-center mx-auto">
          Unlock Your Potential with Resume Craft's Powerful Features
        </h5>

        <div className="flex flex-wrap md:gap-12 gap-8 mx-auto items-center justify-center">
          <FeaturesCard
            icon={<FaRegClock size={20} />}
            title={"Automation"}
            description={
              "Cut down hours of manual tweaking. Resume Craft automates the customization process, allowing you to focus on what matters – your skills and experience."
            }
          />
          <FeaturesCard
            icon={<FaRegFileAlt size={20} />}
            title={"ATS Optimization"}
            description={
              "Our system is designed to enhance your resume's compatibility with Applicant Tracking Systems, increasing your chances of getting noticed."
            }
          />
          <FeaturesCard
            icon={<FaCodeBranch size={20} />}
            title={"Versatility"}
            description={
              "Tailor your resume for diverse job opportunities effortlessly. Resume Craft adapts to different roles, industries, and requirements."
            }
          />
        </div>
      </section>
    </>
  );
};
export default LandingPage;
