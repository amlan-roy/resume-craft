import React, { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { SECTION, formType } from "@/lib/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";
import TextInput from "@/components/global/form/form-inputs/TextInput";
import DeleteConfirmationDialog from "../../DeleteConfirmationDialog";

type AdditionalProps = {
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

const Additional: React.FC<AdditionalProps> = ({ deleteSection, index }) => {
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
      <Card data-card-type={SECTION.ADDITIONAL}>
        <HiddenInput
          fieldName={
            index !== undefined && index !== null
              ? `${fieldName}.${index}.type`
              : undefined
          }
          value={SECTION.ADDITIONAL}
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
            title="Delete this section"
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
            placeholder={
              "- Did ABC to achieve DEF\n- Won XYZ competition\n- Have a rating of 100 in PQR"
            }
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

      <DeleteConfirmationDialog
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
export default Additional;
