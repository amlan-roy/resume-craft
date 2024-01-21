import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TextInputProps = {
  autoComplete?: string;
  className?: string;
  errorMessage?: string;
  fieldName?: string;
  inputClassName?: string;
  label?: string;
  multiline?: boolean;
  placeholder?: string;
  // todo: use proper type for register
  register?: any;
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
          {...(register && fieldName ? register(fieldName) : {})}
          autoComplete={autoComplete}
          className={cn("my-3", inputClassName)}
        />
      ) : (
        <Input
          placeholder={placeholder}
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
