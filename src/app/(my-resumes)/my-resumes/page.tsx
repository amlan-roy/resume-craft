"use client";

import React, { useEffect, useState } from "react";
import {
  deleteResume,
  getBaseResumeData,
  getResumeVariantData,
} from "@/lib/services/resume-service";
import {
  ResumeVariantData,
  UserDocumentBaseResumeData,
  UserDocumentResumeVariantData,
} from "@/lib/types/resume-response";
import { auth } from "@/lib/utils/firebase/config";
import { useToast } from "@/components/ui/use-toast";
import LoadingSkeleton from "@/components/auth/LoadingSkeleton";
import PopupDialog from "@/components/global/dialog/PopupDialog";
import ResumeCard from "@/components/my-resumes/ResumeCard";

type MyResumesPageProps = {};

const MyResumesPage: React.FC<MyResumesPageProps> = () => {
  const [baseResumeData, setBaseResumeData] =
    useState<null | UserDocumentBaseResumeData>(null);

  const [resumeVariantData, setResumeVariantData] = useState<
    null | UserDocumentResumeVariantData[]
  >(null);

  const [isLoading, setIsLoading] = useState(true);

  const { toast: displayToast } = useToast();

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    resolve?: (value: unknown) => void;
  }>({
    open: false,
    title: "",
    description: "",
    confirmText: "",
    cancelText: "",
    resolve: (value: unknown) => {},
  });

  const downloadResume = (url: string) => {
    window.open(url, "_blank");
  };

  const displayErrorToast = (errorMessage: string) => {
    displayToast({
      title: "An error occurred!",
      description: errorMessage,
      variant: "destructive",
    });
    console.error(e);
  };

  const resetDialogState = () => {
    setDialogState(() => {
      return {
        open: false,
        title: "",
        description: "",
        confirmText: "",
        cancelText: "",
      };
    });
  };

  useEffect(() => {
    // Fetch the user's resume data
    auth
      .authStateReady()
      .then(async () => {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const baseResumeData = (await getBaseResumeData(
            userId
          )) as UserDocumentBaseResumeData;
          const resumeVariantData = (await getResumeVariantData(
            userId
          )) as ResumeVariantData;
          setBaseResumeData(baseResumeData);
          Object.values(resumeVariantData || {}).length &&
            setResumeVariantData(Object.values(resumeVariantData));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <section className="container mx-auto p-8">
        <h1 className="text-3xl tex font-bold mb-4">My Generated Resumes</h1>
        <p className="text-xl text-gray-600 mb-8">
          {isLoading
            ? "Loading your resumes..."
            : !baseResumeData?.downloadUrl && !resumeVariantData?.length
              ? "No resumes found. Generate a new resume to view here."
              : "These are your past generated resumes"}
        </p>

        {isLoading ? (
          <div className="flex w-full flex-wrap gap-6 mt-12">
            <LoadingSkeleton className="w-full " />
          </div>
        ) : (
          <div className="flex w-full flex-wrap items-start flex-col gap-6 mt-12">
            {baseResumeData && baseResumeData.downloadUrl && (
              <>
                <h2 className="text-2xl font-bold text-brand-neutral-8 text-left w-full">
                  Base Resume
                </h2>

                <ResumeCard
                  title={baseResumeData?.downloadFileName || "Base Resume"}
                  subtitle={
                    baseResumeData?.timeUpdated &&
                    `Last updated: ${new Date(baseResumeData.timeUpdated).toLocaleString()}`
                  }
                  callbacks={{
                    download: {
                      onClick: () => {
                        downloadResume(baseResumeData.downloadUrl || "");
                      },
                      onError: (e: Error) => {
                        const errorMessage =
                          e.message ||
                          "An error occurred while downloading the resume!";
                        displayErrorToast(errorMessage);
                        dialogState.resolve?.(false);
                        resetDialogState();
                      },
                    },
                    delete: {
                      onClick: async () => {
                        if (dialogState.open) return;
                        const proceed = await new Promise((resolve) => {
                          setDialogState({
                            open: true,
                            title: "Delete Resume",
                            description:
                              "Are you sure you want to delete the resume?",
                            confirmText: "Delete",
                            cancelText: "Cancel",
                            resolve,
                          });
                        });
                        if (!proceed) return;
                        await deleteResume(auth.currentUser?.uid || "", "base");
                        setBaseResumeData(null);
                        displayToast({
                          title: "Deleted Successfully!",
                          description: "Deleted the resume successfully!",
                          variant: "default",
                        });
                      },
                      onError: (e: Error) => {
                        const errorMessage =
                          e.message ||
                          "An error occurred while deleting the resume!";
                        displayErrorToast(errorMessage);
                        dialogState.resolve?.(false);
                        resetDialogState();
                      },
                    },
                  }}
                />
              </>
            )}
            {!!resumeVariantData?.length && (
              <>
                <h2 className="text-2xl font-bold text-brand-neutral-8 text-left w-full">
                  Variant Resume
                </h2>
                <div className="flex w-full flex-wrap items-start gap-6 justify-between">
                  {resumeVariantData.map((value, index) => {
                    return (
                      <>
                        <ResumeCard
                          key={index}
                          title={
                            value?.downloadFileName ||
                            `Resume Variant ${value.formId}`
                          }
                          subtitle={
                            value?.timeUpdated &&
                            `Last updated: ${new Date(value.timeUpdated).toLocaleString()}`
                          }
                          callbacks={{
                            download: {
                              onClick: () => {
                                downloadResume(value.downloadUrl || "");
                              },
                              onError: (e: Error) => {
                                const errorMessage =
                                  e.message ||
                                  "An error occurred while downloading the resume!";
                                displayErrorToast(errorMessage);
                                dialogState.resolve?.(false);
                                resetDialogState();
                              },
                            },
                            delete: {
                              onClick: async () => {
                                if (dialogState.open) return;
                                const proceed = await new Promise((resolve) => {
                                  setDialogState({
                                    open: true,
                                    title: "Delete Resume",
                                    description:
                                      "Are you sure you want to delete the resume?",
                                    confirmText: "Delete",
                                    cancelText: "Cancel",
                                    resolve,
                                  });
                                });
                                if (!proceed) return;

                                await deleteResume(
                                  auth.currentUser?.uid || "",
                                  value.formId
                                );
                                setResumeVariantData((prev) => {
                                  return (
                                    prev?.filter((_, i) => {
                                      return i !== index;
                                    }) || []
                                  );
                                });
                                displayToast({
                                  title: "Deleted Successfully!",
                                  description:
                                    "Deleted the resume successfully!",
                                  variant: "default",
                                });
                              },
                              onError: (e: Error) => {
                                const errorMessage =
                                  e.message ||
                                  "An error occurred while deleting the resume!";
                                displayErrorToast(errorMessage);
                                dialogState.resolve?.(false);
                                resetDialogState();
                              },
                            },
                          }}
                        />
                      </>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
        <PopupDialog
          open={dialogState.open}
          title={dialogState.title}
          description={dialogState.description}
          confirmText={dialogState.confirmText}
          cancelText={dialogState.cancelText}
          onConfirm={() => {
            dialogState.resolve?.(true);
            resetDialogState();
          }}
          onCancel={() => {
            dialogState.resolve?.(false);
            resetDialogState();
          }}
        />
      </section>
    </>
  );
};
export default MyResumesPage;
