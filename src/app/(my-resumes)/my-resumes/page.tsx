"use client";

import React, { useEffect, useState } from "react";
import { DownloadIcon, TrashIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import LoadingSkeleton from "@/components/auth/LoadingSkeleton";

// Todo: Move this to a separate component, and add tests for it as well
const ResumeCard = ({
  title = "Resume",
  subtitle,
  onDownload,
  onDelete,
  onError,
}: {
  title?: string;
  subtitle?: string;
  onDownload?: Function;
  onDelete?: Function;
  onError?: Function;
}) => {
  const [loadingState, setLoadingState] = useState(false);

  return (
    <Card className="w-full max-w-xl bg-brand-secondary-green-1 rounded-lg p-4">
      <CardTitle className="text-2xl font-bold text-brand-neutral-11 break-words">
        {title}
      </CardTitle>
      {subtitle && (
        <CardDescription className="text-base text-brand-neutral-8 break-words">
          {subtitle}
        </CardDescription>
      )}
      <CardFooter className="w-full justify-end mt-4 flex-wrap px-6 py-0">
        <Button
          variant={"ghost"}
          type="button"
          title="Download the resume"
          aria-label="Download the resume"
          disabled={loadingState}
          onClick={async () => {
            try {
              setLoadingState(() => true);
              !loadingState && (await onDownload?.());
              setLoadingState(() => false);
            } catch (e) {
              console.error(e);
              onError?.(e);
              setLoadingState(() => false);
            }
          }}
        >
          <DownloadIcon size={24} />
        </Button>
        <Button
          variant={"ghost"}
          type="button"
          title="Delete the resume"
          disabled={loadingState}
          aria-label="Delete the resume"
          onClick={async () => {
            try {
              setLoadingState(() => true);
              !loadingState && (await onDelete?.());
              setLoadingState(() => false);
            } catch (e) {
              console.error(e);
              onError?.(e);
              setLoadingState(() => false);
            }
          }}
        >
          <TrashIcon size={24} />
        </Button>
      </CardFooter>
    </Card>
  );
};

type MyResumesPageProps = {};

const MyResumesPage: React.FC<MyResumesPageProps> = () => {
  const [baseResumeData, setBaseResumeData] =
    useState<null | UserDocumentBaseResumeData>(null);
  const [resumeVariantData, setResumeVariantData] = useState<
    null | UserDocumentResumeVariantData[]
  >(null);

  const [isLoading, setIsLoading] = useState(true);

  const { toast: displayToast } = useToast();

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
          {!baseResumeData?.downloadUrl && !resumeVariantData?.length
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
                  onDownload={() => {
                    window.open(baseResumeData.downloadUrl, "_blank");
                  }}
                  onDelete={async () => {
                    await deleteResume(auth.currentUser?.uid || "", "base");
                    setBaseResumeData(null);
                  }}
                  onError={(e: Error) => {
                    const errorMessage = e.message || "An error occurred!";
                    displayToast({
                      title: "Error",
                      description: errorMessage,
                      variant: "destructive",
                    });
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
                          onDownload={() => {
                            window.open(value.downloadUrl, "_blank");
                          }}
                          onDelete={async () => {
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
                              description: "Deleted the resume successfully!",
                              variant: "default",
                            });
                          }}
                          onError={(e: Error) => {
                            const errorMessage =
                              e.message || "An error occurred!";
                            displayToast({
                              title: "Error",
                              description: errorMessage,
                              variant: "destructive",
                            });
                          }}
                        />
                        {/* <Card
                      key={index}
                      className="w-full bg-brand-primary-brown-3 rounded-lg"
                    >
                      <CardContent>
                        <div className="w-full my-6 flex items-center justify-between flex-wrap">
                          <div>
                            <h3 className="text-2xl font-bold text-brand-neutral-11">
                              {value?.downloadFileName ||
                                `Resume Variant ${value.formId}`}
                            </h3>
                            {value?.timeUpdated && (
                              <p className="text-base text-brand-neutral-8">
                                {"Last updated: "}
                                {new Date(value.timeUpdated).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div>
                            <Button
                              variant={"ghost"}
                              type="button"
                              title="Download variant resume"
                              onClick={() => {
                                window.open(value.downloadUrl, "_blank");
                              }}
                            >
                              <DownloadIcon size={24} />
                            </Button>
                            <Button
                              variant={"ghost"}
                              type="button"
                              title="Delete variant resume"
                              onClick={async () => {
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
                              }}
                            >
                              <TrashIcon size={24} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card> */}
                      </>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
};
export default MyResumesPage;
