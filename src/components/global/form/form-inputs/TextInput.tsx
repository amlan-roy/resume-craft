import React from "react";
import { Control, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TextInputProps = {
  fieldName: string;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  control?: Control<FieldValues> | undefined;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  autoComplete?: string;
  inputClassName?: string;
};

const TextInput: React.FC<TextInputProps> = ({
  control,
  fieldName,
  label,
  placeholder,
  type,
  multiline,
  className,
  inputClassName,
  autoComplete,
}) => {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-lg md:text-xl text-brand-neutral-11">
              {label}
            </FormLabel>
          )}
          <FormControl>
            {multiline ? (
              <Textarea
                placeholder={placeholder}
                {...field}
                autoComplete={autoComplete}
                className={inputClassName}
              />
            ) : (
              <Input
                placeholder={placeholder}
                {...field}
                type={type}
                autoComplete={autoComplete}
                className={inputClassName}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default TextInput;
