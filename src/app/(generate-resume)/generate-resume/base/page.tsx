"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useTimeout } from "@/lib/hooks/useTimeout";
import { mailToLinks } from "@/lib/utils/string-helpers";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ToastAction } from "@radix-ui/react-toast";
import axios from "axios";

type GenerateResumeHomePageProps = {};

const GenerateResumeHomePage: React.FC<GenerateResumeHomePageProps> = () => {
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const [baseResumeData] = useLocalStorage("base-resume-data-local");

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

  const onGenerateClick = async () => {
    try {
      setDownloadData((prev) => ({ ...prev, state: "in-progress" }));

      const downloadState = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/data-formatting?action=generateResume${params.get("mockTrue") ? "&mockTrue=true" : ""}`,
        {
          resumeData: baseResumeData,
          id: "base",
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
        const downloadUrlRes = await axios(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/data-formatting?action=getDownloadLink${params.get("mockTrue") ? "&mockTrue=true" : ""}`
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

  useEffect(() => {
    if (!!!baseResumeData) {
      setShowRedirectModal(true);
    } else {
      setShowRedirectModal(false);
    }
  }, []);

  return (
    <>
      <div
        className={`max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 mx-auto`}
      >
        <h1 className="text-brand-neutral-11 text-4xl font-bold text-center">
          Generate a Resume from your base data
        </h1>
        <p className="text-brand-neutral-11 text-md text-center my-8">
          You can generate a resume feom the base data that you have entered
        </p>

        <section className="flex flex-col items-center gap-4">
          <Link href={"/enter-data?redirectTo=base"}>
            <Button className="max-w-80 w-full">
              Preview/Update your base data
            </Button>
          </Link>
          <Button
            className="max-w-80 w-full"
            disabled={downloadData.state === "in-progress"}
            onClick={onGenerateClick}
          >
            {downloadData.state === "in-progress"
              ? "Generating..."
              : downloadData.state === "success"
                ? "Re-generate Resume"
                : "Generate Resume"}
          </Button>
          {downloadData.state === "success" && (
            <>
              <div className="my-8">
                <h4 className="text-xl font-bold text-center">
                  Your resume has been generated and saved
                </h4>
                <p className="text-brand-neutral-11 text-md text-center my-8 mt-4">
                  Your Resume has been generated and saved to your google drive.
                  <br />
                  {downloadData.downloadUrl && (
                    <>
                      Click{" "}
                      <a
                        className="font-bold"
                        href={downloadData.downloadUrl}
                        target="_blank"
                        title="Download your resume"
                      >
                        here
                      </a>{" "}
                      to download a PDF of your resume.
                    </>
                  )}
                </p>
              </div>
              <Alert className="w-fit bg-brand-secondary-blue-2">
                <AlertDescription>
                  <strong>Note:</strong> Your resume has been saved to your
                  google drive. If you feel the need to edit it, please feel
                  free to do so.
                </AlertDescription>
              </Alert>
            </>
          )}
          <Toaster />
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
export default GenerateResumeHomePage;
