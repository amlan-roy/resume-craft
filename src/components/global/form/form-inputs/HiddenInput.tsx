import React from "react";
import { Control, FieldValues } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type HiddenInputProps = {
  fieldName: string;
  control?: Control<FieldValues> | undefined;
  value: string | number;
};

const HiddenInput: React.FC<HiddenInputProps> = ({
  control,
  fieldName,
  value,
}) => {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="hidden">
          <FormControl>
            <Input {...field} type={"hidden"} value={value} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
export default HiddenInput;
