import React from "react";
import { Input } from "@/components/ui/input";
import { formType } from "@/lib/types/form";
import { UseFormRegister } from "react-hook-form";

type HiddenInputProps = {
  fieldName?: string;
  register?: UseFormRegister<formType>;
  value: string | number;
};

const HiddenInput: React.FC<HiddenInputProps> = ({
  register,
  fieldName,
  value,
}) => {
  return (
    <Input
      type={"hidden"}
      hidden={true}
      value={value}
      data-testid="hidden-input__container"
      // todo: Fix this ts error later
      // @ts-expect-error: React hooks form reuire these names (fieldName here) as a literal (so would require exact name)
      {...(register && fieldName ? register(fieldName) : {})}
    />
  );
};
export default HiddenInput;
