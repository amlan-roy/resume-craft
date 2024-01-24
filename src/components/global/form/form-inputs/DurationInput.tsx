"use client";
import React, { useEffect } from "react";
import {
  Control,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import DateInput from "./DateInput";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type DurationInputProps = {
  fieldName: string;
  subFieldNames: {
    startDate: string;
    endDate: string;
    current: string;
  };
  control?: Control<FieldValues> | undefined;
  labels?: {
    startDate?: string;
    endDate?: string;
    current?: string;
  };
  className?: string;
  //Todo: Once a complete type for the form schame is ready, then update this any to it
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
};

const DurationInput: React.FC<DurationInputProps> = ({
  fieldName,
  control,
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
  watch,
  setValue,
}) => {
  const endDate = watch(`${fieldName}.${subFieldNames.endDate}`);
  const currentlyWorking = watch(`${fieldName}.${subFieldNames.current}`);

  return (
    <div
      className={cn(["flex w-full gap-12 items-center flex-wrap", className])}
    >
      <DateInput
        fieldName={`${fieldName}.${subFieldNames.startDate}`}
        control={control}
        label={labels.startDate}
      />
      <DateInput
        fieldName={`${fieldName}.${subFieldNames.endDate}`}
        control={control}
        label={labels.endDate}
        onSelect={(selectedDate) => {
          // manually set the checkbox as undefined when end date is selected
          if (selectedDate) {
            setValue(`${fieldName}.${subFieldNames.current}`, undefined);
          }
        }}
      />
      <FormField
        control={control}
        name={`${fieldName}.${subFieldNames.current}`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 self-end">
            <FormControl>
              <Checkbox
                title={labels.current || "Current"}
                checked={!!currentlyWorking}
                onCheckedChange={(checkedState) => {
                  field.onChange(checkedState);
                  setValue(`${fieldName}.${subFieldNames.endDate}`, undefined);
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
