"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useTimeout } from "@/lib/hooks/useTimeout";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type GenerateResumePageProps = {};

const GenerateResumePage: React.FC<GenerateResumePageProps> = () => {
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const router = useRouter();
  const [baseResumeData, setBaseResumeData] = useLocalStorage(
    "base-resume-data-local"
  );

  // Reditect to enter data route with the correct query params
  // 2 seconds after redirect modal is shown
  useTimeout(
    () => {
      router.push("/enter-data?showDisclaimer=true&generateFlow=true");
    },
    showRedirectModal ? 2000 : null
  );

  useEffect(() => {
    if (!!!baseResumeData) {
      setShowRedirectModal(true);
    } else {
      setShowRedirectModal(false);
    }
  }, []);
  return (
    <>
      <div>Have a good coding</div>
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
export default GenerateResumePage;
