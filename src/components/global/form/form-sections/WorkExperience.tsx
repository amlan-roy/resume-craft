import React, { useContext } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { SECTION, formType, workExperienceFieldSchema } from "@/lib/types/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import DurationInput from "@/components/global/form/form-inputs/DurationInput";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";
import TextInput from "@/components/global/form/form-inputs/TextInput";
import SectionTemplate from "@/components/global/form/form-sections/SectionTemplate";
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

type WorkExperienceProps = {
  //todo: Getting the error: "Types of property '_reset' are incompatible." in page.tsx where this WorkExperience component is called
  // Adding this any in the type to ignore the error for now, but will need to fix it later
  deleteSection: () => void;
  index: number;
  fieldErrors?: any;
  fields?: z.infer<typeof workExperienceFieldSchema>[];
  updateFields?: (addFields?: boolean, index?: number) => void;
};

const WorkExperience: React.FC<WorkExperienceProps> = ({
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
      "WorkExperience section component must be used within a DynamicForm component"
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
    <SectionTemplate
      sectionType={SECTION.WORK_EXPERIENCE}
      fieldName={fieldName}
      register={register}
      sectionIndex={index}
    >
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
            handleDelete();
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
                  handleDelete(subSectionIndex, fields?.length === 1)
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
                    ? `${fieldName}.[${index}].fields.[${subSectionIndex}].jobTitle`
                    : undefined
                }
                register={register}
                label="Job Title"
                autoComplete="organization-title"
                placeholder="Jethalal Gada"
                className="w-full lg:max-w-[30%] md:max-w-[45%]"
                errorMessage={
                  fieldErrors?.fields?.[subSectionIndex]?.jobTitle?.message
                }
              />
              <TextInput
                fieldName={
                  fieldName && (index !== undefined || index !== null)
                    ? `${fieldName}.[${index}].fields.[${subSectionIndex}].jobSubtitle`
                    : undefined
                }
                register={register}
                label="Job subtitle"
                placeholder="Jethalal Gada"
                className="w-full lg:max-w-[30%] md:max-w-[45%]"
                errorMessage={
                  fieldErrors?.fields?.[subSectionIndex]?.jobSubtitle?.message
                }
              />
              <TextInput
                fieldName={
                  fieldName && (index !== undefined || index !== null)
                    ? `${fieldName}.[${index}].fields.[${subSectionIndex}].companyName`
                    : undefined
                }
                register={register}
                label="Company Name"
                autoComplete="organization"
                placeholder="Gada Electronics"
                className="w-full lg:max-w-[30%] md:max-w-[45%]"
                errorMessage={
                  fieldErrors?.fields?.[subSectionIndex]?.companyName?.message
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
                autoComplete="address-level2"
                placeholder="Gokuldham Society"
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
                  current: "I an currently working here",
                }}
              />
              <TextInput
                fieldName={
                  fieldName && (index !== undefined || index !== null)
                    ? `${fieldName}.[${index}].fields.[${subSectionIndex}].details`
                    : undefined
                }
                label="Description"
                multiline
                register={register}
                placeholder={
                  "- Managed electronics store for 20+ years\n- Generated job opportunitites for many people\n- Earned a lot of money"
                }
                className="w-full"
                errorMessage={
                  fieldErrors?.fields?.[subSectionIndex]?.details?.message
                }
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
    </SectionTemplate>
  );
};
export default WorkExperience;
