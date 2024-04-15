import React, { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { SECTION, formType } from "@/lib/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PopupDialog from "@/components/global/dialog/PopupDialog";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";
import TextInput from "@/components/global/form/form-inputs/TextInput";

type ProfessionalSummaryProps = {
  deleteSection: () => void;
  index?: number;
};

const fieldName = "optionalSections";

const TEXT_COPIES = {
  MODAL: {
    cancelText: "Cancel",
    confirmText: "Confirm",
    description:
      "This action cannot be undone. This will permanently the data that you have entered for this section.",
    title: "Do you want to delete this section?",
  },
};

const ProfessionalSummary: React.FC<ProfessionalSummaryProps> = ({
  deleteSection,
  index,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<formType>();

  const [modalState, setModalState] = useState<{
    open: boolean;
  }>({
    open: false,
  });
  return (
    <>
      <Card
        data-testid="form-sections__professional-summary"
        data-card-type={SECTION.PROFESSIONAL_SUMMARY}
        className="bg-brand-secondary-blue-1"
      >
        <HiddenInput
          fieldName={
            index !== undefined && index !== null
              ? `${fieldName}.${index}.type`
              : undefined
          }
          value={SECTION.PROFESSIONAL_SUMMARY}
          register={register}
        />
        <CardHeader className="text-brand-neutral-11 flex flex-row flex-wrap w-full justify-between">
          <CardTitle className="w-full max-w-[75%]">
            <Label>Section Title:</Label>
            <TextInput
              fieldName={
                index !== undefined && index !== null
                  ? `${fieldName}.${index}.sectionTitle`
                  : undefined
              }
              register={register}
              inputClassName="text-xl md:text-2xl py-6"
              placeholder="Section title"
              errorMessage={
                index !== undefined
                  ? errors?.[fieldName]?.[index]?.sectionTitle?.message
                  : undefined
              }
            />
          </CardTitle>

          <button
            className="ml-auto"
            onClick={() => {
              setModalState({
                open: true,
              });
            }}
            type="button"
            data-testid="form-sections__delete-icon"
            title="Delete section"
          >
            <Trash2Icon />
          </button>
        </CardHeader>
        <CardContent className="flex flex-wrap w-full">
          <Label>Details:</Label>
          <TextInput
            fieldName={
              index !== undefined && index !== null
                ? `${fieldName}.${index}.fields.value`
                : undefined
            }
            register={register}
            multiline
            className="w-full"
            placeholder="Galactic Theorist with decades of experience, specializing in unraveling the fabric of the cosmos and visiting islands. Proficient in quantum mechanics, general relativity, and little people. Experienced in solving complex quadratic equations."
            errorMessage={
              index !== undefined
                ? // todo: fix this later
                  // @ts-expect-error: some ts error
                  errors?.[fieldName]?.[index]?.fields?.value?.message
                : undefined
            }
          />
        </CardContent>
      </Card>

      <PopupDialog
        open={modalState.open}
        onCancel={() => {
          setModalState({ open: false });
        }}
        onConfirm={() => {
          deleteSection?.();
          setModalState({ open: false });
        }}
        title={TEXT_COPIES.MODAL.title}
        description={TEXT_COPIES.MODAL.description}
        cancelText={TEXT_COPIES.MODAL.cancelText}
        confirmText={TEXT_COPIES.MODAL.confirmText}
      />
    </>
  );
};
export default ProfessionalSummary;
