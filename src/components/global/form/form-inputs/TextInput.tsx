import React from "react";
import { UseFormRegister } from "react-hook-form";
import { formType } from "@/lib/types/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TextInputProps = {
  autoComplete?: string;
  className?: string;
  errorMessage?: string;
  fieldName?: string;
  inputClassName?: string;
  label?: string;
  multiline?: boolean;
  placeholder?: string;
  register?: UseFormRegister<formType>;
  type?: React.HTMLInputTypeAttribute;
};

const TextInput: React.FC<TextInputProps> = ({
  autoComplete,
  className,
  errorMessage,
  fieldName,
  inputClassName,
  label,
  multiline,
  placeholder,
  register,
  type,
}) => {
  return (
    <div className={className} data-testid="text-input__container">
      {label && (
        <Label className="text-lg md:text-xl text-brand-neutral-11">
          {label}
        </Label>
      )}
      {multiline ? (
        <Textarea
          placeholder={placeholder}
          // todo: Fix this ts error later
          // @ts-expect-error: React hooks form reuire these names (fieldName here) as a literal (so would require exact name)
          {...(register && fieldName ? register(fieldName) : {})}
          autoComplete={autoComplete}
          className={cn("my-3", inputClassName)}
        />
      ) : (
        <Input
          placeholder={placeholder}
          // todo: Fix this ts error later
          // @ts-expect-error: React hooks form reuire these names (fieldName here) as a literal (so would require exact name)
          {...(register && fieldName ? register(fieldName) : {})}
          type={type}
          autoComplete={autoComplete}
          className={cn("my-3", inputClassName)}
        />
      )}
      {errorMessage && (
        <p className="text-sm font-medium text-destructive">
          {errorMessage?.toString()}
        </p>
      )}
    </div>
  );
};
export default TextInput;
