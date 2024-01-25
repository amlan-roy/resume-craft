import React from "react";
import { Trash2Icon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TextInput from "@/components/global/form/form-inputs/TextInput";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";
import { SECTION, formType } from "@/lib/types/form";
import { useFormContext } from "react-hook-form";

type ProfessionalSummaryProps = {
  sectionTitle?: string;
  deleteSection: () => void;
  index?: number;
};

const fieldName = "optionalSections";

const ProfessionalSummary: React.FC<ProfessionalSummaryProps> = ({
  deleteSection,
  index,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<formType>();
  return (
    <Card
      data-testid="form-sections__professional-summary"
      data-card-type={SECTION.PROFESSIONAL_SUMMARY}
    >
      <HiddenInput
        fieldName={
          fieldName && index ? `${fieldName}.${index}.type` : undefined
        }
        value={SECTION.PROFESSIONAL_SUMMARY}
        register={register}
      />
      <CardHeader className="text-brand-neutral-11 flex flex-row flex-wrap w-full justify-between">
        <CardTitle className="w-full max-w-[75%]">
          <TextInput
            fieldName={
              fieldName && index
                ? `${fieldName}.${index}.sectionTitle`
                : undefined
            }
            register={register}
            inputClassName="text-xl md:text-2xl py-6"
            placeholder="Section title"
            errorMessage={
              index
                ? errors?.[fieldName]?.[index]?.sectionTitle?.message
                : undefined
            }
          />
        </CardTitle>

        <button
          className="ml-auto"
          onClick={deleteSection}
          type="button"
          data-testid="form-sections__delete-icon"
        >
          <Trash2Icon />
        </button>
      </CardHeader>
      <CardContent className="flex flex-wrap w-full gap-5">
        <TextInput
          fieldName={
            fieldName && index
              ? `${fieldName}.[${index}].fields.value`
              : undefined
          }
          register={register}
          multiline
          className="w-full"
          placeholder="Galactic Theorist with decades of experience, specializing in unraveling the fabric of the cosmos and visiting islands. Proficient in quantum mechanics, general relativity, and little people. Experienced in solving complex quadratic equations."
          errorMessage={
            index
              ? // todo: fix this later
                // @ts-expect-error: some ts error
                errors?.[fieldName]?.[index]?.fields?.value?.message
              : undefined
          }
        />
      </CardContent>
    </Card>
  );
};
export default ProfessionalSummary;
