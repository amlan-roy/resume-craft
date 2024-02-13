import React from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formSchema,
  resumeVariantGenerationFormSchema,
} from "@/lib/types/form";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { addBackSensitiveInformation } from "@/lib/utils/data-formatting";

type StepThreeProps = {
  id: string;
} & React.HTMLAttributes<HTMLDivElement>;

const StepThree: React.FC<StepThreeProps> = ({ id, ...props }) => {
  const router = useRouter();

  const { trigger, getValues, setError } =
    useFormContext<z.infer<typeof resumeVariantGenerationFormSchema>>();

  const [resumeData, setResumeData] = useLocalStorage(
    `${id}-resume-data-local`
  );

  const [baseResumeData] = useLocalStorage("base-resume-data-local");

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
            const enteredData = getValues().modifiedResumeJSON;
            const enteredDataObjWithSensitiveInfo =
              enteredData &&
              addBackSensitiveInformation(
                JSON.parse(enteredData),
                JSON.parse(baseResumeData)
              );
            if (
              !formSchema.safeParse(enteredDataObjWithSensitiveInfo).success
            ) {
              setError(
                "modifiedResumeJSON",
                {
                  message:
                    "The entered data is not in the correct format. Please try entering both the commands in a new chatGPT conversation. If the issue continues, please write to us",
                },
                { shouldFocus: true }
              );
            } else {
              setResumeData(JSON.stringify(enteredDataObjWithSensitiveInfo));
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
