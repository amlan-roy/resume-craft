"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type PageProps = {};

const Page: React.FC<PageProps> = () => {
  const router = useRouter();

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

          <Button
            variant={"outline"}
            title="Generate resume variant"
            onClick={(e) => {
              e.preventDefault();
              const randomFormId = fetchRandomId(8);
              router.push(`/generate-resume/${randomFormId}`);
            }}
          >
            Generate Variant
          </Button>
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

function fetchRandomId(additionalLength: number) {
  const idChars: string = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const now: Date = new Date();
  let id = now.getTime().toString().slice(-8);
  for (let i = 0; i < additionalLength; i++)
    id += idChars[Math.floor(Math.random() * idChars.length)];
  return id;
}

export default Page;
