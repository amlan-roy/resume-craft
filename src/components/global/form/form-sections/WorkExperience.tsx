import React from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import HiddenInput from "@/components/global/form/form-inputs/HiddenInput";
import TextInput from "@/components/global/form/form-inputs/TextInput";
import { SECTION, formType, workExperienceFieldSchema } from "@/lib/types/form";
import { Button } from "@/components/ui/button";
import DurationInput from "../form-inputs/DurationInput";
import { z } from "zod";

const fieldName = "optionalSections";

type WorkExperienceProps = {
  //todo: Getting the error: "Types of property '_reset' are incompatible." in page.tsx where this WorkExperience component is called
  // Adding this any in the type to ignore the error for now, but will need to fix it later
  deleteSection: () => void;
  index: string;
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

  return (
    <Card data-card-type={SECTION.WORK_EXPERIENCE}>
      <HiddenInput
        fieldName={fieldName && index && `${fieldName}.${index}.type`}
        value={SECTION.WORK_EXPERIENCE}
        register={register}
      />
      <CardHeader className="text-brand-neutral-11 flex flex-row flex-wrap w-full justify-between">
        <CardTitle className="w-full max-w-[75%]">
          <TextInput
            fieldName={
              fieldName && index && `${fieldName}.${index}.sectionTitle`
            }
            register={register}
            inputClassName="text-xl md:text-2xl py-6"
            placeholder="Section title"
            errorMessage={fieldErrors?.sectionTitle?.message}
          />
        </CardTitle>

        <Button
          className="ml-auto"
          onClick={deleteSection}
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
                onClick={() => updateFields?.(false, subSectionIndex)}
                title="Delete this sub-section"
              >
                <Trash2Icon className=" w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap gap-10">
              <TextInput
                fieldName={
                  fieldName &&
                  index &&
                  `${fieldName}.[${index}].fields.[${subSectionIndex}].jobTitle`
                }
                register={register}
                label="Job Title"
                autoComplete="organization-title"
                placeholder="Jethalal Gada"
                className="w-full lg:max-w-[30%] md:max-w-[45%]"
                errorMessage={
                  fieldErrors?.fields[subSectionIndex]?.jobTitle?.message
                }
              />
              <TextInput
                fieldName={
                  fieldName &&
                  index &&
                  `${fieldName}.[${index}].fields.[${subSectionIndex}].companyName`
                }
                register={register}
                label="Company Name"
                autoComplete="organization"
                placeholder="Gada Electronics"
                className="w-full lg:max-w-[30%] md:max-w-[45%]"
                errorMessage={
                  fieldErrors?.fields[subSectionIndex]?.companyName?.message
                }
              />
              <TextInput
                fieldName={
                  fieldName &&
                  index &&
                  `${fieldName}.[${index}].fields.[${subSectionIndex}].location`
                }
                register={register}
                label="Location"
                autoComplete="address-level2"
                placeholder="Gokuldham Society"
                className="w-full lg:max-w-[30%] md:max-w-[45%]"
                errorMessage={
                  fieldErrors?.fields[subSectionIndex]?.location?.message
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
                  fieldName &&
                  index &&
                  `${fieldName}.[${index}].fields.[${subSectionIndex}].details`
                }
                label="Description"
                multiline
                register={register}
                placeholder={
                  "- Managed electronics store for 20+ years\n- Generated job opportunitites for many people\n- Earned a lot of money"
                }
                className="w-full"
                errorMessage={
                  fieldErrors?.fields[subSectionIndex]?.details?.message
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
    </Card>
  );
};
export default WorkExperience;
