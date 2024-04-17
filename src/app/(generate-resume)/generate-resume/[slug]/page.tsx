"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DEFAULT_FORM_DATA } from "@/lib/const/generate-resume/generate-resume";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useTimeout } from "@/lib/hooks/useTimeout";
import {
  getResumeFormData,
  makeGenerateResumeRequest,
  setResumeFormData,
} from "@/lib/services/resume-service";
import { formType, resumeVariantGenerationFormSchema } from "@/lib/types/form";
import { auth } from "@/lib/utils/firebase/config";
import { mailToLinks } from "@/lib/utils/string-helpers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import LoadingGenResumeForm from "@/components/generate-resume/variant/LoadingGenResumeForm";
import StepFour from "@/components/generate-resume/variant/StepFour";
import StepOne from "@/components/generate-resume/variant/StepOne";
import StepThree from "@/components/generate-resume/variant/StepThree";
import StepTwo from "@/components/generate-resume/variant/StepTwo";

type GenerateVariantHomePageProps = { params: { slug: string } };

const GenerateVariantHomePage: React.FC<GenerateVariantHomePageProps> = ({
  params: dynamicParams,
}) => {
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const id = dynamicParams.slug;
  const [baseResumeData, setBaseResumeData] = useState<null | formType>(null);
  const [resumeVariantData, setResumeVariantData] = useState<null | formType>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useLocalStorage(`gen-resume-form-data-${id}`);
  const [uid, setUid] = useState<string | null>(null);

  const form = useForm<z.infer<typeof resumeVariantGenerationFormSchema>>({
    resolver: zodResolver(resumeVariantGenerationFormSchema),
    defaultValues: formData ? JSON.parse(formData) : DEFAULT_FORM_DATA,
  });

  const { getValues, watch } = form;

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
    auth.authStateReady().then(() => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        setUid(userId);
        getResumeFormData(userId, "base")
          .then((resumeFormData) => {
            if (resumeFormData) {
              setBaseResumeData(resumeFormData);
              setShowRedirectModal(false);
              setLoading(false);
            } else {
              setShowRedirectModal(true);
            }
          })
          .catch(() => {
            setShowRedirectModal(true);
          });
        getResumeFormData(userId, id).then((resumeVariantData) => {
          if (resumeVariantData) {
            setResumeVariantData(resumeVariantData);
          }
          setLoading(false);
        });
      }
    });
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      setFormData(JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onGenerateClick = async () => {
    try {
      if (!!!auth.currentUser?.emailVerified) {
        displayToast({
          title: "Please verify your email",
          description: "You need to verify your email to generate your resume",
          variant: "destructive",
        });
        return;
      }
      if (!resumeVariantData) {
        displayToast({
          title: "Please fill in the required fields",
          description:
            "You need to fill in the required fields to generate your resume",
          variant: "destructive",
        });
        return;
      }
      setDownloadData((prev) => ({ ...prev, state: "in-progress" }));
      const downloadState = await makeGenerateResumeRequest(
        JSON.stringify(resumeVariantData),
        auth.currentUser?.uid || "",
        getValues().customResumeName || id,
        id,
        !!params.get("mockTrue")
      );

      if (
        downloadState.status.toString().startsWith("4") ||
        downloadState.status.toString().startsWith("5")
      ) {
        setDownloadData((prev) => ({ ...prev, state: "failure" }));
        throw new Error("Error occurred");
      }

      if (downloadState.status.toString().startsWith("2")) {
        const downloadUrl = downloadState.data.downloadUrl;
        setDownloadData((prev) => ({
          ...prev,
          downloadUrl,
          state: downloadUrl ? "success" : "failure",
        }));
      }
    } catch (err) {
      console.error(err);
      setDownloadData((prev) => ({ ...prev, state: "failure" }));
      displayToast({
        title: "An error has occurred while generating your resume!",
        description:
          "Please try again later.\n If the error continues, pleas report the issue to us.",
        action: (
          <ToastAction
            altText="Report Error"
            onClick={() => {
              router.push(mailToLinks());
            }}
            className="border-2 py-1 px-2 rounded-md"
          >
            Report Error
          </ToastAction>
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 mx-auto">
        <h1 className="text-brand-neutral-11 text-4xl font-bold text-center">
          Generate A Resume variant
        </h1>
        <p className="text-brand-neutral-11 text-md text-center my-8">
          Follow the steps mentioned below to create your resume variant
        </p>

        {loading ? (
          <LoadingGenResumeForm />
        ) : (
          <section className="flex flex-col items-center gap-4">
            <>
              <Form {...form}>
                <form className="space-y-8 w-full">
                  <StepOne />
                  <StepTwo
                    baseResumeData={JSON.stringify(baseResumeData)}
                    setResumeVariantData={(data: formType) => {
                      if (!uid) return;
                      setResumeVariantData(data);

                      setResumeFormData(uid, id, data);
                    }}
                    resumeVariantData={JSON.stringify(resumeVariantData)}
                  />
                  <StepThree
                    id={id}
                    setResumeVariantData={(data: formType) => {
                      if (!uid) return;
                      setResumeVariantData(data);

                      setResumeFormData(uid, id, data);
                    }}
                    resumeVariantData={JSON.stringify(resumeVariantData)}
                  />
                  <StepFour />
                  <div className="w-full flex justify-end">
                    <Button
                      className="max-w-80 w-full"
                      disabled={downloadData.state === "in-progress"}
                      type="button"
                      onClick={onGenerateClick}
                    >
                      {downloadData.state === "in-progress"
                        ? "Generating..."
                        : downloadData.state === "success"
                          ? "Re-generate Resume"
                          : downloadData.state === "failure"
                            ? "Resume Generation Failed"
                            : "Generate Resume"}
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="w-full flex justify-end">
                <Button
                  className="max-w-80 w-full"
                  disabled={downloadData.state === "in-progress"}
                  onClick={() => {
                    router.push("/home");
                  }}
                >
                  Generate another resume
                </Button>
              </div>
              {downloadData.state === "success" && (
                <>
                  <Alert className="w-fit bg-brand-secondary-blue-2">
                    <AlertTitle className="text-xl font-bold text-center">
                      Your resume has been generated and saved
                    </AlertTitle>
                    <AlertDescription>
                      <p className="text-brand-neutral-11 text-md text-center my-8 mt-4">
                        Your Resume has been generated and saved securely.
                        {downloadData.downloadUrl && (
                          <>
                            {" Click "}
                            <a
                              className="font-bold"
                              href={downloadData.downloadUrl}
                              target="_blank"
                              title="Download your resume"
                            >
                              here
                            </a>{" "}
                            to download a PDF of your resume.
                            <br />
                            <br />
                            Click{" "}
                            <a
                              className="font-bold"
                              href="/my-resumes"
                              title="View all your generated resumes"
                            >
                              here
                            </a>{" "}
                            to view all your generated resumes.
                          </>
                        )}
                      </p>
                    </AlertDescription>
                  </Alert>
                </>
              )}
              <Toaster />
            </>
          </section>
        )}
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
