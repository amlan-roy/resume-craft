import React from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { resumeVariantGenerationFormSchema } from "@/lib/types/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type StepThreeProps = {
  id: string;
  // Todo: Add types for these values and typecast in the appropriate places
  resumeVariantData?: any;
  setResumeVariantData: any;
  baseResumeData?: any;
} & React.HTMLAttributes<HTMLDivElement>;

const StepThree: React.FC<StepThreeProps> = ({
  id,
  resumeVariantData,
  setResumeVariantData,
  baseResumeData,
  ...props
}) => {
  const router = useRouter();

  const { setError } =
    useFormContext<z.infer<typeof resumeVariantGenerationFormSchema>>();

  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Step 3: Verify / Update the generated Data{" "}
          <span className="font-light">(Optional but recommended)</span>
        </h2>
      </CardHeader>
      <CardContent>
        <Button
          type="button"
          onClick={async () => {
            if (!resumeVariantData) {
              setError(
                "modifiedResumeJSON",
                {
                  message:
                    "Oops. Looks like you have missed validating this input. Please enter a valid response from the last command here.",
                },
                { shouldFocus: true }
              );
            } else {
              router.push(`/enter-data?redirectTo=${id}&id=${id}`);
            }
          }}
        >
          Click here to verify / update the generated resume
        </Button>
      </CardContent>
    </Card>
  );
};
export default StepThree;
