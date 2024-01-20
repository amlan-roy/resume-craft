import React from "react";
import { Input } from "@/components/ui/input";

type HiddenInputProps = {
  fieldName?: string;
  register?: any;
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
      value={value}
      {...(register && fieldName ? register(fieldName) : {})}
    />
  );
};
export default HiddenInput;
