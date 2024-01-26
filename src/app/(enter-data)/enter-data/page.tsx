"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  SECTION,
  formSchema,
  formType,
  projectsSectionSchema,
  workExperienceSectionSchema,
} from "@/lib/types/form";
import BasicDetails from "@/components/global/form/form-sections/BasicDetails";
import ProfessionalSummary from "@/components/global/form/form-sections/ProfessionalSummary";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findFirstFocusable } from "@/lib/utils/findFirstFocusableElemInLastCard";
import WorkExperience from "@/components/global/form/form-sections/WorkExperience";
import { z } from "zod";
import Projects from "@/components/global/form/form-sections/Projects";

type EnterDataPageProps = {};

const EnterDataPage: React.FC<EnterDataPageProps> = () => {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicDetails: {
        type: SECTION.BASIC_DETAILS,
        sectionTitle: "Basic Details",
        fields: {},
      },
      optionalSections: [
        {
          type: SECTION.PROFESSIONAL_SUMMARY,
          sectionTitle: "Professional Summary",
          fields: {
            value: "",
          },
        },
        {
          type: SECTION.WORK_EXPERIENCE,
          sectionTitle: "Work Experience",
          fields: [
            { jobTitle: "", details: "", companyName: "", location: "" },
          ],
        },
        {
          type: SECTION.PROJECTS,
          sectionTitle: "Projects",
          fields: [
            {
              projectTitle: "",
              projectSubtitle: "",
              projectUrl: undefined,
              associatedWith: undefined,
              details: "",
            },
          ],
        },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const {
    fields,
    append,
    remove: deleteSection,
    update: updateSection,
  } = useFieldArray({
    control,
    name: "optionalSections", // unique name for your Field Array
  });

  const onSubmit = (values: formType) => {
    console.log(values);
  };

  const submitHandler = handleSubmit(onSubmit);

  const addSection = (sectionType: SECTION) => {
    switch (sectionType) {
      case SECTION.PROFESSIONAL_SUMMARY:
        append({
          sectionTitle: "Professional Summary",
          type: SECTION.PROFESSIONAL_SUMMARY,
          fields: {
            value: "",
          },
        });
        break;
      case SECTION.WORK_EXPERIENCE:
        append({
          sectionTitle: "Work Experience",
          type: SECTION.WORK_EXPERIENCE,
          fields: [
            {
              jobTitle: "",
              details: "",
            },
          ],
        });
        break;
      case SECTION.PROJECTS:
        append({
          sectionTitle: "Relevant Projects",
          type: SECTION.PROJECTS,
          fields: [
            {
              projectTitle: "",
              details: "",
            },
          ],
        });
        break;
    }
  };

  const [focusOnLastSection, setFocusOnLastSection] = useState(false);

  return (
    <>
      <section className="max-w-screen-xl overflow-hidden px-4 sm:px-6 mt-10 mx-auto mb-28">
        <h1 className="text-brand-neutral-12 text-center text-6xl font-bold">
          Enter Your Data
        </h1>
        <p className="text-brand-neutral-10 text-center text-2xl mt-11">
          This data will be used to generate the customised resume for different
          job types. Fill in this detail as accurately as possible. You can
          refer this{" "}
          <Link
            href={
              "https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2023/08/College-resume-and-cover-letter.pdf"
            }
            target="_blank"
            aria-label="Visit the external link to harvard resume guide"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          >
            {"Harvard Resume Guide"}
          </Link>{" "}
          and{" "}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="link"
                className="text-brand-neutral-10 text-center text-2xl m-0 px-0"
              >
                Google&apos;s X-Y-Z format
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-96">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">
                    Google&apos;s X-Y-Z format
                  </h4>
                  <p className="text-sm">
                    The Google resume x y z format is a way of writing your
                    resume that emphasizes your accomplishments and skills using
                    a simple formula.
                    <br />
                    <br />
                    The formula is: “Accomplished [X] as measured by [Y], by
                    doing [Z].”
                    <br />
                    <br />
                    For example, “Managed a community support program (X) that
                    saved $2 million (Y), by designing a streamlined customer
                    service portal (Z).”
                    <br />
                    <br />
                    This format helps you showcase your achievements and how
                    they relate to the job you are applying for. It also makes
                    it easier for recruiters to understand your value and
                    potential.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>{" "}
          for reference.
        </p>
      </section>
      <div className="max-w-screen-xl overflow-hidden p-4 sm:px-6 mt-10 mx-auto mb-28">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log(form.formState.errors);
              submitHandler(e);
            }}
            className="space-y-8"
          >
            <section className="w-full flex flex-col gap-8">
              {/* Todo: Fix This Later */}
              {/* @ts-ignore */}
              <BasicDetails fieldName={"basicDetails"} />
              {fields.map((field, sectionIndex) => {
                switch (field.type) {
                  case SECTION.PROFESSIONAL_SUMMARY:
                    return (
                      <ProfessionalSummary
                        key={field.id}
                        deleteSection={() => {
                          deleteSection(sectionIndex);
                        }}
                        index={sectionIndex}
                      />
                    );
                  case SECTION.WORK_EXPERIENCE:
                    return (
                      <WorkExperience
                        key={field.id}
                        deleteSection={() => {
                          deleteSection(sectionIndex);
                        }}
                        index={sectionIndex}
                        fieldErrors={errors?.optionalSections?.[sectionIndex]}
                        fields={field.fields}
                        updateFields={(
                          addFields?: boolean,
                          index?: number
                        ): void => {
                          if (addFields) {
                            // Directly using form.fields here causes an issue where when we click the add section button after the form is first rendered and if the subsections have some value in it, then
                            // the form.fields will not have the values from the UI. And hence when the button is clicked and a new section is added, then the previous values are lost
                            // However, after this, the values in form.fields are updated correctly and no values are lost on subsequent subsection additions.
                            // So we need to use form.getValues instead
                            const currentField = form.getValues()
                              .optionalSections[sectionIndex] as z.infer<
                              typeof workExperienceSectionSchema
                            >;
                            const currentFields = currentField?.fields;
                            const updatedFields = [...(currentFields || [])];
                            updatedFields.push({
                              jobTitle: "",
                              details: "",
                              companyName: "",
                              location: "",
                            });
                            updateSection(sectionIndex, {
                              ...currentField,
                              fields: updatedFields,
                            });
                            return;
                          }
                          if (index || index === 0) {
                            const currentField = form.getValues()
                              .optionalSections[sectionIndex] as z.infer<
                              typeof workExperienceSectionSchema
                            >;
                            const currentFields = currentField?.fields;
                            const updatedFields = [...(currentFields || [])];
                            updatedFields.splice(index, 1);
                            updateSection(sectionIndex, {
                              ...currentField,
                              fields: updatedFields,
                            });
                          }
                        }}
                      />
                    );
                  case SECTION.PROJECTS:
                    return (
                      <Projects
                        key={field.id}
                        deleteSection={() => {
                          deleteSection(sectionIndex);
                        }}
                        index={sectionIndex}
                        fieldErrors={errors?.optionalSections?.[sectionIndex]}
                        fields={field.fields}
                        updateFields={(
                          addFields?: boolean,
                          index?: number
                        ): void => {
                          if (addFields) {
                            // Directly using form.fields here causes an issue where when we click the add section button after the form is first rendered and if the subsections have some value in it, then
                            // the form.fields will not have the values from the UI. And hence when the button is clicked and a new section is added, then the previous values are lost
                            // However, after this, the values in form.fields are updated correctly and no values are lost on subsequent subsection additions.
                            // So we need to use form.getValues instead
                            const currentField = form.getValues()
                              .optionalSections[sectionIndex] as z.infer<
                              typeof projectsSectionSchema
                            >;
                            const currentFields = currentField?.fields;
                            const updatedFields = [...(currentFields || [])];
                            updatedFields.push({
                              projectTitle: "",
                              details: "",
                            });
                            updateSection(sectionIndex, {
                              ...currentField,
                              fields: updatedFields,
                            });
                            return;
                          }
                          if (index || index === 0) {
                            const currentField = form.getValues()
                              .optionalSections[sectionIndex] as z.infer<
                              typeof projectsSectionSchema
                            >;
                            const currentFields = currentField?.fields;
                            const updatedFields = [...(currentFields || [])];
                            updatedFields.splice(index, 1);
                            updateSection(sectionIndex, {
                              ...currentField,
                              fields: updatedFields,
                            });
                          }
                        }}
                      />
                    );
                }
              })}
            </section>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="m-4">
                  Add Section
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onCloseAutoFocus={(e: Event) => {
                  if (focusOnLastSection) {
                    e.preventDefault();
                    const firstFocusableInLastCard = findFirstFocusable();
                    firstFocusableInLastCard?.scrollIntoView({
                      behavior: "smooth",
                    });
                    firstFocusableInLastCard?.focus();
                    setFocusOnLastSection(false);
                  }
                }}
              >
                <DropdownMenuLabel>Select section to add</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-add-section-menu-item="PROFESSIONAL_SUMMARY"
                  onSelect={() => {
                    setFocusOnLastSection(true);
                    addSection(SECTION.PROFESSIONAL_SUMMARY);
                  }}
                >
                  Professional Summary
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-add-section-menu-item="WORK_EXPERIENCE"
                  onSelect={() => {
                    setFocusOnLastSection(true);
                    addSection(SECTION.WORK_EXPERIENCE);
                  }}
                >
                  Work Experience
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-add-section-menu-item="PROJECTS"
                  onSelect={() => {
                    setFocusOnLastSection(true);
                    addSection(SECTION.PROJECTS);
                  }}
                >
                  Projects
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="submit">Submit</Button>
            <Button type="button" variant={"secondary"}>
              {" "}
              Print Values
            </Button>
            <Button type="button" variant={"secondary"}>
              {" "}
              Print Errors
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
export default EnterDataPage;
