import React from "react";
import { UseFormRegister } from "react-hook-form";
import { SECTION, formType } from "@/lib/types/form";
import { Card } from "@/components/ui/card";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";

type SectionTemplateProps = {
  sectionType: SECTION;
  sectionIndex?: number;
  fieldName: string;
  register: UseFormRegister<formType>;
  children?: React.ReactNode;
  [key: string]: any;
};

const SectionTemplate: React.FC<SectionTemplateProps> = ({
  sectionType,
  fieldName,
  sectionIndex,
  register,
  children,
  ...rest
}) => {
  return (
    <Card
      data-card-type={sectionType}
      className="bg-brand-secondary-blue-1"
      {...rest}
    >
      <HiddenInput
        fieldName={`${fieldName}${sectionIndex !== undefined ? `.${sectionIndex}` : ""}.type`}
        value={sectionType}
        register={register}
      />
      {children}
    </Card>
  );
};
export default SectionTemplate;
