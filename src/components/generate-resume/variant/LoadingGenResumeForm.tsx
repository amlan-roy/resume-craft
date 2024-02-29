import LoadingSkeleton from "@/components/auth/LoadingSkeleton";
import React from "react";

type LoadingGenResumeFormProps = {};

const LoadingGenResumeForm: React.FC<LoadingGenResumeFormProps> = () => {
  return (
    <section className="flex flex-col items-center gap-4 w-full">
      <LoadingSkeleton className="w-full" />
      <LoadingSkeleton className="w-full" />
      <LoadingSkeleton className="w-full" />
    </section>
  );
};
export default LoadingGenResumeForm;
