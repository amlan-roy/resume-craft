"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useTimeout } from "@/lib/hooks/useTimeout";
import { useToast } from "@/components/ui/use-toast";
import { resumeVariantGenerationFormSchema } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import StepOne from "@/components/generate-resume/variant/StepOne";
import StepTwo from "@/components/generate-resume/variant/StepTwo";
import StepThree from "@/components/generate-resume/variant/StepThree";

type GenerateVariantHomePageProps = { params: { slug: string } };

const GenerateVariantHomePage: React.FC<GenerateVariantHomePageProps> = ({
  params: dynamicParams,
}) => {
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const id = dynamicParams.slug;
  const [baseResumeData] = useLocalStorage("base-resume-data-local");

  const form = useForm<z.infer<typeof resumeVariantGenerationFormSchema>>({
    resolver: zodResolver(resumeVariantGenerationFormSchema),
  });

  const { trigger, getValues } = form;

  const [downloadData, setDownloadData] = useState<{
    downloadUrl?: string;
    state: "neutral" | "in-progress" | "success" | "failure";
  }>({
    state: "neutral",
  });

  const { toast: displayToast } = useToast();

  // Reditect to enter data route with the correct query params
  // 2 seconds after redirect modal is shown
  useTimeout(
    () => {
      router.push("/enter-data?showDisclaimer=true&redirectTo=base");
    },
    showRedirectModal ? 2000 : null
  );

  useEffect(() => {
    if (!!!baseResumeData) {
      setShowRedirectModal(true);
    } else {
      setShowRedirectModal(false);
    }
  }, [baseResumeData]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fieldsValid = await trigger(undefined, {
      shouldFocus: true,
    });
    if (fieldsValid) {
      const downloadState = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/data-formatting?action=generateResume${params.get("mockTrue") ? "&mockTrue=true" : ""}`,
        {
          resumeData: baseResumeData,
          id: getValues().customResumeName || id,
        }
      );

      if (
        downloadState.status.toString().startsWith("4") ||
        downloadState.status.toString().startsWith("5")
      ) {
        setDownloadData((prev) => ({ ...prev, state: "failure" }));
        throw new Error("Error occurred");
      }

      if (downloadState.status.toString().startsWith("2")) {
        const downloadUrlRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/data-formatting?action=getDownloadLink&id=${getValues().customResumeName || id}${params.get("mockTrue") ? "&mockTrue=true" : ""}`
        );

        if (!downloadUrlRes?.data?.downloadUrl) {
          setDownloadData((prev) => ({
            ...prev,
            downloadUrl: undefined,
            state: "success",
          }));
        } else {
          setDownloadData((prev) => ({
            ...prev,
            downloadUrl: downloadUrlRes.data.downloadUrl,
            state: "success",
          }));
        }
      }
      // fieldsValid && setDownloadData(prev => ({...prev, state: "success",}));
    }
  };

  return (
    <>
      {/* Todo: Remove pb-32 after issue #48 is fixed */}
      <div className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 mx-auto pb-32">
        <h1 className="text-brand-neutral-11 text-4xl font-bold text-center">
          Generate A Resume variant
        </h1>
        <p className="text-brand-neutral-11 text-md text-center my-8">
          Follow the steps mentioned below to create your resume variant
        </p>

        <section className="flex flex-col items-center gap-4">
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-8 w-full">
              <StepOne />
              <StepTwo baseResumeData={baseResumeData} />
              <StepThree id={id} />
            </form>
          </Form>
        </section>
      </div>
      <AlertDialog open={showRedirectModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You need to enter your base resume data to proceed
            </AlertDialogTitle>
            <AlertDialogDescription>
              Redirecting you to enter your data...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default GenerateVariantHomePage;
