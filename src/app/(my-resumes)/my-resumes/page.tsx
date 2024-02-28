"use client";

import LoadingSkeleton from "@/components/auth/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteResume,
  getResumeVariantData,
} from "@/lib/services/resume-service";
import {
  ResumeVariantData,
  UserDocumentBaseResumeData,
  UserDocumentResumeVariantData,
} from "@/lib/types/resume-response";
import { auth } from "@/lib/utils/firebase/config";
import { DownloadIcon, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type MyResumesPageProps = {};

const MyResumesPage: React.FC<MyResumesPageProps> = () => {
  const [baseResumeData, setBaseResumeData] =
    useState<null | UserDocumentBaseResumeData>(null);
  const [resumeVariantData, setResumeVariantData] = useState<
    null | UserDocumentResumeVariantData[]
  >(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's resume data
    auth
      .authStateReady()
      .then(async () => {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const baseResumeData = (await getResumeVariantData(
            userId
          )) as UserDocumentBaseResumeData;
          const resumeVariantData = (await getResumeVariantData(
            userId
          )) as ResumeVariantData;
          setBaseResumeData(baseResumeData);
          Object.values(resumeVariantData).length &&
            setResumeVariantData(Object.values(resumeVariantData));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <section className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 mx-auto mb-28">
        <h1 className="md:text-6xl text-5xl font-bold text-brand-neutral-11 text-center">
          My Resumes
        </h1>
        <p className="md:text-2xl text-base text-brand-neutral-8 mt-14 text-center">
          These are your past generated resumes
        </p>

        {isLoading ? (
          <div className="flex w-full flex-wrap gap-6 mt-12">
            <LoadingSkeleton className="w-full " />
          </div>
        ) : (
          <div className="flex w-full flex-wrap items-center flex-col gap-6 mt-12">
            {baseResumeData && baseResumeData.downloadUrl && (
              <>
                <h2 className="text-3xl font-bold text-brand-neutral-11 text-left w-full">
                  Base Resume
                </h2>
                <Card className="w-full bg-brand-primary-brown-3 rounded-lg">
                  <CardContent>
                    <div className="w-full my-6 flex items-center justify-between flex-wrap">
                      <div>
                        <h3 className="text-2xl font-bold text-brand-neutral-11">
                          {baseResumeData?.downloadFileName || "Base Resume"}
                        </h3>
                        {baseResumeData?.timeUpdated && (
                          <p className="text-base text-brand-neutral-8">
                            {"Last updated: "}
                            {new Date(
                              baseResumeData.timeUpdated
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div>
                        <Button
                          variant={"ghost"}
                          type="button"
                          title="Download base resume"
                          onClick={() => {
                            window.open(baseResumeData.downloadUrl, "_blank");
                          }}
                        >
                          <DownloadIcon size={24} />
                        </Button>
                        <Button
                          variant={"ghost"}
                          type="button"
                          title="Delete base resume"
                          onClick={async () => {
                            await deleteResume(
                              auth.currentUser?.uid || "",
                              "base"
                            );
                            setBaseResumeData(null);
                          }}
                        >
                          <TrashIcon size={24} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {!!resumeVariantData?.length && (
              <>
                <h2 className="text-3xl font-bold text-brand-neutral-11 text-left w-full">
                  Variant Resume
                </h2>
                {resumeVariantData.map((value, index) => {
                  return (
                    <Card
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
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
};
export default MyResumesPage;
