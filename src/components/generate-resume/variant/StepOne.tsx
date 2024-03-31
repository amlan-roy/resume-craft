import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { resumeVariantGenerationFormSchema } from "@/lib/types/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type StepOneProps = {} & React.HTMLAttributes<HTMLDivElement>;

const StepOne: React.FC<StepOneProps> = ({ ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<z.infer<typeof resumeVariantGenerationFormSchema>>();

  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Step 1: Enter the job description
        </h2>
      </CardHeader>
      <CardContent>
        <div data-testid="text-input__container">
          <Textarea
            placeholder={"Enter the job description"}
            {...register("jobDescription")}
            className={"my-3"}
          />
          {errors.jobDescription && (
            <p className="text-sm font-medium text-destructive">
              {errors.jobDescription.message?.toString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default StepOne;
