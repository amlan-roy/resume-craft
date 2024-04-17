import React, { useContext } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { SECTION, formType, skillsFieldSchema } from "@/lib/types/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";
import TextInput from "@/components/global/form/form-inputs/TextInput";
import { ModalStateContext } from "@/components/global/form/modal-state-provider";

const fieldName = "optionalSections";

const TEXT_COPIES = {
  MODAL: {
    DELETE_SECTION: {
      cancelText: "Cancel",
      confirmText: "Confirm",
      description:
        "This action cannot be undone. This will permanently the data that you have entered for this section.",
      title: "Do you want to delete this section?",
    },
    DELETE_SUBSECTION: {
      cancelText: "Cancel",
      confirmText: "Confirm",
      description:
        "This action cannot be undone. This will permanently the data that you have entered for this sub-section.",
      title: "Do you want to delete this sub-section?",
    },
    DELETE_LAST_SUBSECTION: {
      cancelText: "Cancel",
      confirmText: "Confirm",
      description:
        "This section should at least have one sub section. Since you're trying to delete the last sub section of this section, continuing with this action will delete the whole section and you will loose the data that you've entered in this section. Do you want to continue with this action?",
      title:
        "Deleting this sub-section will delete the whole section. Do you want to continue?",
    },
  },
};

type SkillsProps = {
  //todo: Getting the error: "Types of property '_reset' are incompatible." in page.tsx where this Skills component is called
  // Adding this any in the type to ignore the error for now, but will need to fix it later
  deleteSection: () => void;
  index: number;
  fieldErrors?: any;
  fields?: z.infer<typeof skillsFieldSchema>[];
  updateFields?: (addFields?: boolean, index?: number) => void;
};

const Skills: React.FC<SkillsProps> = ({
  deleteSection,
  index,
  fieldErrors,
  fields,
  updateFields,
}) => {
  const { register } = useFormContext<formType>();

  const modalStateContext = useContext(ModalStateContext);

  if (!modalStateContext) {
    throw new Error(
      "Skills section component must be used within a DynamicForm component"
    );
  }

  const handleDelete = (
    subSectionIndex?: number,
    isLastSubsection?: boolean
  ) => {
    const modalTextKey = subSectionIndex
      ? isLastSubsection
        ? "DELETE_LAST_SUBSECTION"
        : "DELETE_SUBSECTION"
      : "DELETE_SECTION";

    const onConfirm = () => {
      if (subSectionIndex && !isLastSubsection) {
        updateFields?.(false, subSectionIndex);
      } else {
        deleteSection?.();
      }
      modalStateContext.setModalState({ isOpen: false });
    };

    const onCancel = () => {
      modalStateContext.setModalState({ isOpen: false });
    };

    modalStateContext.setModalState({
      title: TEXT_COPIES.MODAL?.[modalTextKey].title,
      message: TEXT_COPIES.MODAL?.[modalTextKey].description,
      isOpen: true,
      confirmText: TEXT_COPIES.MODAL?.[modalTextKey].confirmText,
      cancelText: TEXT_COPIES.MODAL?.[modalTextKey].cancelText,
      onConfirm,
      onCancel,
    });
  };

  return (
    <Card
      data-card-type={SECTION.PROJECTS}
      className="bg-brand-secondary-blue-1"
    >
      <HiddenInput
        fieldName={
          fieldName && (index !== undefined || index !== null)
            ? `${fieldName}.${index}.type`
            : undefined
        }
        value={SECTION.PROJECTS}
        register={register}
      />
      <CardHeader className="text-brand-neutral-11 flex flex-row flex-wrap w-full justify-between">
        <CardTitle className="w-full max-w-[75%]">
          <Label>Section Title:</Label>
          <TextInput
            fieldName={
              fieldName && (index !== undefined || index !== null)
                ? `${fieldName}.${index}.sectionTitle`
                : undefined
            }
            register={register}
            inputClassName="text-xl md:text-2xl py-6"
            placeholder="Technical Skills"
            errorMessage={fieldErrors?.sectionTitle?.message}
          />
        </CardTitle>

        <Button
          className="ml-auto"
          onClick={() => handleDelete()}
          type="button"
          variant={"ghost"}
          title="Delete this section"
        >
          <Trash2Icon />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-wrap w-full gap-5">
        {fields?.map((field, subSectionIndex) => (
          <Card
            className="w-full"
            key={`projects-${index}-subsection-${subSectionIndex}`}
          >
            <CardContent className="mt-5 flex items-center">
              <div className="flex flex-row flex-wrap gap-10 w-full">
                <TextInput
                  fieldName={
                    fieldName && (index !== undefined || index !== null)
                      ? `${fieldName}.[${index}].fields.[${subSectionIndex}].title`
                      : undefined
                  }
                  register={register}
                  label="Skill Type"
                  placeholder="Finance"
                  className="w-full  md:max-w-[30%]"
                  errorMessage={
                    fieldErrors?.fields?.[subSectionIndex]?.title?.message
                  }
                />
                <TextInput
                  fieldName={
                    fieldName && (index !== undefined || index !== null)
                      ? `${fieldName}.[${index}].fields.[${subSectionIndex}].skills`
                      : undefined
                  }
                  label="Skills"
                  register={register}
                  placeholder="Accounting, Calculator Expert, Tax Calculations, Counting Money ..."
                  className="w-full lg:max-w-[60%] md:max-w-[55%]"
                  errorMessage={
                    fieldErrors?.fields?.[subSectionIndex]?.skills?.message
                  }
                />
              </div>
              <Button
                type="button"
                variant={"ghost"}
                className="w-fit"
                onClick={() =>
                  handleDelete(subSectionIndex, fields?.length === 1)
                }
                title="Delete this sub-section"
              >
                <Trash2Icon className=" w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant={"outline"}
          onClick={() => updateFields?.(true)}
          className="py-6"
        >
          <PlusCircleIcon className="w-8 h-8 mr-4" />
          <span className="text-base">Add Sub Section</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default Skills;
