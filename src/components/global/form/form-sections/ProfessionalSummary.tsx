import React from "react";
import { Control, FieldValues } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TextInput from "@/components/global/form/form-inputs/TextInput";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";
import { SECTION } from "@/lib/types/form";

type ProfessionalSummaryProps = {
  sectionTitle?: string;
  control?: Control<FieldValues> | undefined;
  deleteSection: () => void;
  index: string;
};

const ProfessionalSummary: React.FC<ProfessionalSummaryProps> = ({
  sectionTitle = "Professional Summary",
  control,
  deleteSection,
  index,
}) => {
  return (
    <Card data-form-section="PROFESSIONAL_SUMMARY">
      <HiddenInput
        fieldName={`optionalSections.${index}.type`}
        value={SECTION.PROFESSIONAL_SUMMARY}
        control={control}
      />
      <CardHeader className="text-brand-neutral-11 flex flex-row flex-wrap w-full justify-between">
        {sectionTitle && (
          <CardTitle>
            <TextInput
              fieldName={`optionalSections.${index}.sectionTitle`}
              control={control}
              inputClassName="text-xl md:text-2xl py-6"
            />
          </CardTitle>
        )}
        <button className="ml-auto" onClick={deleteSection} type="button">
          <Trash2Icon />
        </button>
      </CardHeader>
      <CardContent className="flex flex-wrap w-full gap-5">
        <TextInput
          fieldName={`optionalSections[${index}].fields.value`}
          control={control}
          multiline
          className="w-full"
          placeholder="Galactic Theorist with decades of experience, specializing in unraveling the fabric of the cosmos and visiting islands. Proficient in quantum mechanics, general relativity, and little people. Experienced in solving complex quadratic equations."
        />
      </CardContent>
    </Card>
  );
};
export default ProfessionalSummary;
