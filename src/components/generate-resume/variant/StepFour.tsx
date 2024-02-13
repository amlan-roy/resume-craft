import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { resumeVariantGenerationFormSchema } from "@/lib/types/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type StepFourProps = {} & React.HTMLAttributes<HTMLDivElement>;

const StepFour: React.FC<StepFourProps> = ({ ...props }) => {
  const { register } =
    useFormContext<z.infer<typeof resumeVariantGenerationFormSchema>>();
  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Step 4: Enter custom resume name{" "}
          <span className="font-light">(Optional)</span>
        </h2>
      </CardHeader>
      <CardContent>
        <div data-testid="text-input__container">
          <Label className="text-brand-neutral-11">
            Any custom name that you want your resume to be stored as?
          </Label>
          <Input
            placeholder={"Enter the job description"}
            {...register("customResumeName")}
            className={"my-3"}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default StepFour;
