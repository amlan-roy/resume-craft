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
        <div className="flex w-full flex-wrap items-center flex-col gap-6 mt-12 max-w-64 mx-auto">
          <Link href={"/generate-resume"} className="w-full">
            <Button
              className="w-full text-wrap"
              variant={"outline"}
              title="Generate Base Resume"
            >
              Generate Base Resume
            </Button>
          </Link>

          <Button
            variant={"outline"}
            className="w-full text-wrap"
            title="Generate resume variant"
            onClick={(e) => {
              e.preventDefault();
              const randomFormId = fetchRandomId(8);
              router.push(`/generate-resume/${randomFormId}`);
            }}
          >
            Generate Variant
          </Button>
          <Link href={"/enter-data"} className="w-full">
            <Button
              title="Edit base resume data"
              variant={"outline"}
              className="w-full text-wrap"
            >
              Edit Base Resume
            </Button>
          </Link>
          <Link href={"/my-resumes"} className="w-full">
            <Button
              title="View your generated resumes"
              variant={"outline"}
              className="w-full text-wrap"
            >
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
