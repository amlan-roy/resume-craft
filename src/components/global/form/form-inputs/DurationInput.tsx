"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import DateInput from "./DateInput";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formType } from "@/lib/types/form";

type DurationInputProps = {
  fieldName: string;
  subFieldNames: {
    startDate: string;
    endDate: string;
    current: string;
  };
  labels?: {
    startDate?: string;
    endDate?: string;
    current?: string;
  };
  className?: string;
};

const DurationInput: React.FC<DurationInputProps> = ({
  fieldName,
  labels = {
    startDate: "Start Date",
    endDate: "End Date",
    current: "Current",
  },
  className,
  subFieldNames = {
    startDate: "startDate",
    endDate: "endDate",
    current: "current",
  },
}) => {
  const { watch, setValue, control } = useFormContext<formType>();

  // todo: Fix this ts error later
  // @ts-expect-error: React hooks form reuire these names (the param here) as a literal (so would require exact name)
  const endDate = watch(`${fieldName}.${subFieldNames.endDate}`);
  // todo: Fix this ts error later
  // @ts-expect-error: React hooks form reuire these names (the param here) as a literal (so would require exact name)
  const currentlyWorking = watch(`${fieldName}.${subFieldNames.current}`);

  return (
    <div
      className={cn(["flex w-full gap-12 items-center flex-wrap", className])}
    >
      <DateInput
        fieldName={`${fieldName}.${subFieldNames.startDate}`}
        label={labels.startDate}
      />
      <DateInput
        fieldName={`${fieldName}.${subFieldNames.endDate}`}
        label={labels.endDate}
        onSelect={(selectedDate) => {
          // manually set the checkbox as undefined when end date is selected
          if (selectedDate) {
            //Todo: Fix this ts error later
            // @ts-expect-error: This is a ts error. Fix it later.
            setValue(`${fieldName}.${subFieldNames.current}`, undefined);
          }
        }}
      />
      <FormField
        control={control}
        // todo: Fix this ts error later
        // @ts-expect-error: React hooks form reuire these name as a literal (so would require exact name)
        name={`${fieldName}.${subFieldNames.current}`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 self-end">
            <FormControl>
              <Checkbox
                title={labels.current || "Current"}
                checked={!!currentlyWorking}
                onCheckedChange={(checkedState) => {
                  field.onChange(checkedState);
                  // todo: Fix this ts error later
                  // @ts-expect-error: React hooks form reuire these names (the first param here) as a literal (so would require exact name)
                  setValue(`${fieldName}.${subFieldNames.endDate}`, undefined);
                  console.log(endDate);
                }}
              />
            </FormControl>
            {labels.current && (
              <div className="space-y-1 leading-none">
                <FormLabel>{labels.current}</FormLabel>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
export default DurationInput;
