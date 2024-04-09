import React, { useState } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { SECTION, educationFieldSchema, formType } from "@/lib/types/form";
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
import DeleteConfirmationDialog from "../../DeleteConfirmationDialog";
import DurationInput from "../form-inputs/DurationInput";

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

type EducationProps = {
  //todo: Getting the error: "Types of property '_reset' are incompatible." in page.tsx where this Education component is called
  // Adding this any in the type to ignore the error for now, but will need to fix it later
  deleteSection: () => void;
  index: number;
  fieldErrors?: any;
  fields?: z.infer<typeof educationFieldSchema>[];
  updateFields?: (addFields?: boolean, index?: number) => void;
};

const Education: React.FC<EducationProps> = ({
  deleteSection,
  index,
  fieldErrors,
  fields,
  updateFields,
}) => {
  const { register } = useFormContext<formType>();
  const [modalState, setModalState] = useState<{
    open: boolean;
    type: "DELETE_SECTION" | "DELETE_SUBSECTION" | "DELETE_LAST_SUBSECTION";
    subsectionToDeleteIndex?: number;
  }>({
    open: false,
    type: "DELETE_SECTION",
  });

  return (
    <>
      <Card data-card-type={SECTION.EDUCATION}>
        <HiddenInput
          fieldName={
            fieldName && (index !== undefined || index !== null)
              ? `${fieldName}.${index}.type`
              : undefined
          }
          value={SECTION.EDUCATION}
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
              placeholder="Section title"
              errorMessage={fieldErrors?.sectionTitle?.message}
            />
          </CardTitle>

          <Button
            className="ml-auto"
            onClick={() => {
              setModalState({
                open: true,
                type: "DELETE_SECTION",
              });
            }}
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
              key={`work-experience-${index}-subsection-${subSectionIndex}`}
            >
              <CardHeader className="items-end">
                <Button
                  type="button"
                  variant={"ghost"}
                  className="w-fit"
                  onClick={() =>
                    setModalState({
                      open: true,
                      type:
                        fields.length > 1
                          ? "DELETE_SUBSECTION"
                          : "DELETE_LAST_SUBSECTION",
                      subsectionToDeleteIndex: subSectionIndex,
                    })
                  }
                  title="Delete this sub-section"
                >
                  <Trash2Icon className=" w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="flex flex-row flex-wrap gap-10">
                <TextInput
                  fieldName={
                    fieldName && (index !== undefined || index !== null)
                      ? `${fieldName}.[${index}].fields.[${subSectionIndex}].universityName`
                      : undefined
                  }
                  register={register}
                  label="University Name"
                  autoComplete="organization-title"
                  placeholder="College of Delusion and Anxiety"
                  className="w-full lg:max-w-[30%] md:max-w-[45%]"
                  errorMessage={
                    fieldErrors?.fields?.[subSectionIndex]?.universityName
                      ?.message
                  }
                />
                <TextInput
                  fieldName={
                    fieldName && (index !== undefined || index !== null)
                      ? `${fieldName}.[${index}].fields.[${subSectionIndex}].degreeName`
                      : undefined
                  }
                  register={register}
                  label="Degree Name"
                  placeholder="Bachelors of Exestential Crisis"
                  className="w-full lg:max-w-[30%] md:max-w-[45%]"
                  errorMessage={
                    fieldErrors?.fields?.[subSectionIndex]?.degreeName?.message
                  }
                />
                <TextInput
                  fieldName={
                    fieldName && (index !== undefined || index !== null)
                      ? `${fieldName}.[${index}].fields.[${subSectionIndex}].majorName`
                      : undefined
                  }
                  register={register}
                  label="Major Name"
                  placeholder="Panic Attack"
                  className="w-full lg:max-w-[30%] md:max-w-[45%]"
                  errorMessage={
                    fieldErrors?.fields?.[subSectionIndex]?.majorName?.message
                  }
                />
                <TextInput
                  fieldName={
                    fieldName && (index !== undefined || index !== null)
                      ? `${fieldName}.[${index}].fields.[${subSectionIndex}].grade`
                      : undefined
                  }
                  register={register}
                  label="Grade"
                  placeholder="9.9/10"
                  className="w-full lg:max-w-[30%] md:max-w-[45%]"
                  errorMessage={
                    fieldErrors?.fields?.[subSectionIndex]?.grade?.message
                  }
                />
                <TextInput
                  fieldName={
                    fieldName && (index !== undefined || index !== null)
                      ? `${fieldName}.[${index}].fields.[${subSectionIndex}].location`
                      : undefined
                  }
                  register={register}
                  label="Location"
                  autoComplete="address-level1"
                  placeholder="Powder Gully, Mumbai"
                  className="w-full lg:max-w-[30%] md:max-w-[45%]"
                  errorMessage={
                    fieldErrors?.fields?.[subSectionIndex]?.location?.message
                  }
                />

                <DurationInput
                  fieldName={`${fieldName}.[${index}].fields.[${subSectionIndex}].duration`}
                  subFieldNames={{
                    startDate: "startDate",
                    endDate: "endDate",
                    current: "current",
                  }}
                  labels={{
                    startDate: "Start Date",
                    endDate: "End Date",
                    current: "I an currently Studying here",
                  }}
                />
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
      <DeleteConfirmationDialog
        open={modalState.open}
        onCancel={() => {
          setModalState((prev) => ({
            ...prev,
            open: false,
            subsectionToDeleteIndex: undefined,
          }));
        }}
        onConfirm={() => {
          ["DELETE_SECTION", "DELETE_LAST_SUBSECTION"].includes(modalState.type)
            ? deleteSection?.()
            : updateFields?.(false, modalState.subsectionToDeleteIndex);
          setModalState((prev) => ({
            ...prev,
            open: false,
            subsectionToDeleteIndex: undefined,
          }));
        }}
        title={TEXT_COPIES.MODAL?.[modalState.type].title}
        description={TEXT_COPIES.MODAL?.[modalState.type].description}
        cancelText={TEXT_COPIES.MODAL?.[modalState.type].cancelText}
        confirmText={TEXT_COPIES.MODAL?.[modalState.type].confirmText}
      />
    </>
  );
};
export default Education;
