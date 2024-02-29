import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type pageProps = {};

const page: React.FC<pageProps> = () => {
  return (
    <>
      <section className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 mx-auto mb-28">
        <h1 className="md:text-6xl text-5xl font-bold text-brand-neutral-11 text-center">
          Home Page
        </h1>
        <p className="md:text-2xl text-base text-brand-neutral-8 mt-14 text-center">
          Select what you want to do today?
        </p>

        <div className="flex w-full flex-wrap items-center flex-col gap-6 mt-12">
          <Link href={"/generate-resume"}>
            <Button
              className="w-fit"
              variant={"outline"}
              title="Generate Base Resume"
            >
              <span className="max-w-64">Generate Base Resume</span>
            </Button>
          </Link>

          <Link href={`/generate-resume/${new Date().getTime()}`}>
            <Button variant={"outline"} title="Generate resume variant">
              Generate Variant
            </Button>
          </Link>
          <Link href={"/enter-data"}>
            <Button title="Edit base resume data" variant={"outline"}>
              Edit Base Resume
            </Button>
          </Link>
          <Link href={"/my-resumes"}>
            <Button title="View your generated resumes" variant={"outline"}>
              View your generated resumes
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};
export default page;
