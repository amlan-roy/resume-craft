"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_FORM_VALUE } from "@/lib/const/form/form-data";
import {
  getResumeFormData,
  setResumeFormData,
} from "@/lib/services/resume-service";
import { formType } from "@/lib/types/form";
import { cleanFormData } from "@/lib/utils/data-formatting";
import { auth } from "@/lib/utils/firebase/config";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import DynamicForm from "@/components/global/form/DynamicForm";
import DynamicFormLoading from "@/components/global/form/DynamicFormLoading";

type EnterDataPageProps = {};

const EnterDataPage: React.FC<EnterDataPageProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const disclaimerVisible = searchParams.has("showDisclaimer");
  const formId = searchParams.get("id");
  const redirectToRoute = searchParams.get("redirectTo");
  const [resumeData, setResumeData] = useState<null | formType>(null);

  const onSubmit = async (values: formType) => {
    const formDataString = cleanFormData(values);
    const uid = auth.currentUser?.uid;
    if (uid && formId) {
      setResumeFormData(uid, formId, formDataString).then(() => {
        setResumeData(formDataString);
        const redirectionPath =
          redirectToRoute === "base"
            ? "/generate-resume/base"
            : redirectToRoute
              ? `/generate-resume/${redirectToRoute}`
              : "/home";

        router.push(redirectionPath);
      });
    }
  };

  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!formId) {
      router.push("/home");
      return;
    }
    auth.authStateReady().then(() => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        getResumeFormData(userId, formId)
          .then((resumeFormData) => {
            if (formId === "base") {
              if (resumeFormData) setResumeData(resumeFormData);
              setIsLoading(false);
            } else if (formId && !!resumeFormData) {
              setResumeData(resumeFormData);
              setIsLoading(false);
            } else {
              router.push("/home");
            }
          })
          .catch(() => {
            router.push("/home");
          });
      }
    });
  }, []);

  return (
    <>
      <section
        className={`max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 mx-auto ${disclaimerVisible ? "mb-16" : "mb-24"}`}
      >
        <h1 className="text-brand-neutral-12 text-center text-6xl font-bold">
          {formId === "base" ? "Enter Your Data" : "Update your resume variant"}
        </h1>
        <p className="text-brand-neutral-10 text-center text-2xl mt-11">
          {formId === "base"
            ? "This is your base resume data. This data will be used to generate the customised resume for different job types. Fill in this detail as accurately as possible."
            : "This is the resume data generated for you using AI. It is advised that you carefully verify / update the data as you see fit"}
          .
          <br />
          You can refer this{" "}
          <Link
            href={
              "https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2023/08/College-resume-and-cover-letter.pdf"
            }
            target="_blank"
            aria-label="Visit the external link to harvard resume guide"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          >
            {"Harvard Resume Guide"}
          </Link>{" "}
          and{" "}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="link"
                className="text-brand-neutral-10 text-center text-2xl m-0 px-0"
              >
                Google&apos;s X-Y-Z format
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-96">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">
                    Google&apos;s X-Y-Z format
                  </h4>
                  <p className="text-sm">
                    The Google resume x y z format is a way of writing your
                    resume that emphasizes your accomplishments and skills using
                    a simple formula.
                    <br />
                    <br />
                    The formula is: “Accomplished [X] as measured by [Y], by
                    doing [Z].”
                    <br />
                    <br />
                    For example, “Managed a community support program (X) that
                    saved $2 million (Y), by designing a streamlined customer
                    service portal (Z).”
                    <br />
                    <br />
                    This format helps you showcase your achievements and how
                    they relate to the job you are applying for. It also makes
                    it easier for recruiters to understand your value and
                    potential.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>{" "}
          for reference.
        </p>
        {disclaimerVisible && (
          <div className="flex flex-col items-start gap-2 rounded-lg border p-3 bg-brand-neutral-4 mt-10">
            <p className="text-center mx-auto text-md">
              You need to enter your base resume data in order to generate
              variants of your resume for different jobs. Please enter your base
              resume data to proceed!
            </p>
          </div>
        )}
      </section>
      <div className="max-w-screen-xl overflow-hidden p-4 sm:px-6 mt-10 mx-auto mb-28">
        {loading ? (
          <DynamicFormLoading />
        ) : (
          <DynamicForm
            defaultValues={
              (JSON.parse(JSON.stringify(resumeData)) ||
                DEFAULT_FORM_VALUE) as formType
            }
            onSubmit={onSubmit}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};
export default EnterDataPage;
