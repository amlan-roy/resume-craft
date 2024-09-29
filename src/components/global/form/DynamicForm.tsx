"use client";

import React, { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  DEFAULT_ADDITIONAL_FORM_VALUE,
  DEFAULT_EDUCATION_FORM_VALUE,
  DEFAULT_FORM_VALUE,
  DEFAULT_PROFESSIONAL_SUMMARY_FORM_VALUE,
  DEFAULT_PROJECTS_FORM_VALUE,
  DEFAULT_SKILLS_FORM_VALUE,
  DEFAULT_WORK_EXPERIENCE_FORM_VALUE,
} from "@/lib/const/form/form-data";
import {
  SECTION,
  educationSectionSchema,
  formSchema,
  formType,
  projectsSectionSchema,
  skillsSectionSchema,
  workExperienceSectionSchema,
} from "@/lib/types/form";
import { findFirstFocusable } from "@/lib/utils/findFirstFocusableElemInLastCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import PopupDialog from "@/components/global/dialog/PopupDialog";
import Additional from "@/components/global/form/form-sections/Additional";
import BasicDetails from "@/components/global/form/form-sections/BasicDetails";
import Education from "@/components/global/form/form-sections/Education";
import Loading from "@/components/global/form/form-sections/Loading";
import ProfessionalSummary from "@/components/global/form/form-sections/ProfessionalSummary";
import Projects from "@/components/global/form/form-sections/Projects";
import Skills from "@/components/global/form/form-sections/Skills";
import WorkExperience from "@/components/global/form/form-sections/WorkExperience";
import ModalStateProvider, { ModalStateContext } from "./modal-state-provider";

type DynamicFormProps = {
  defaultValues?: formType;
  onSubmit: (values: formType) => Promise<void>;
  loading?: boolean;
  confirmationModalTextCopies?: {
    cancelText?: string;
    confirmText?: string;
    description?: string;
    title?: string;
  };
};

const TEXT_COPIES = {
  MODAL: {
    cancelText: "Cancel",
    confirmText: "Confirm",
    description:
      "The existing data (if any) will be overwritten by the new data.",
    title: "Do you want to save this data?",
  },
};

const WrappedDynamicForm: React.FC<DynamicFormProps> = ({ ...props }) => {
  return (
    <ModalStateProvider>
      <DynamicForm {...props} />
    </ModalStateProvider>
  );
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  defaultValues = DEFAULT_FORM_VALUE as formType,
  onSubmit,
  loading,
  confirmationModalTextCopies,
}) => {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = form;

  const {
    fields,
    append,
    remove: deleteSection,
    update: updateSection,
  } = useFieldArray({
    control,
    name: "optionalSections",
  });

  const [focusOnLastSection, setFocusOnLastSection] = useState(false);

  const hasValidationTrigerred = () => {
    return !!Object.keys(form.formState.errors).length;
  };

  // This function is used to trigger validation when a section is deleted
  // Need to manually trigger the validations because once a form field/section is deleted
  // the error message of that deleted field is not cleared and it persists
  // This can cause incorrect error message to be displayed for incorrect fields
  const optionallyTriggerValidationOnDelete = () => {
    if (hasValidationTrigerred()) {
      trigger();
    }
  };

  const addSection = (sectionType: SECTION) => {
    switch (sectionType) {
      case SECTION.PROFESSIONAL_SUMMARY:
        append(DEFAULT_PROFESSIONAL_SUMMARY_FORM_VALUE);
        break;
      case SECTION.WORK_EXPERIENCE:
        append(DEFAULT_WORK_EXPERIENCE_FORM_VALUE);
        break;
      case SECTION.PROJECTS:
        append(DEFAULT_PROJECTS_FORM_VALUE);
        break;
      case SECTION.SKILLS:
        append(DEFAULT_SKILLS_FORM_VALUE);
        break;
      case SECTION.EDUCATION:
        append(DEFAULT_EDUCATION_FORM_VALUE);
        break;
      case SECTION.ADDITIONAL:
        append(DEFAULT_ADDITIONAL_FORM_VALUE);
        break;
    }
  };

  const modalStateContext = useContext(ModalStateContext);

  if (!modalStateContext) {
    throw new Error(
      "DynamicForm component must be used within a ModalStateProvider"
    );
  }

  const {
    isOpen: modalOpen,
    title: modalTitle,
    message: modalMessage,
    confirmText: modalConfirmText,
    cancelText: modalCancelText,
    onConfirm: modalOnConfirm,
    onCancel: modalOnCancel,
  } = modalStateContext.modalState;

  return (
    <ModalStateProvider>
      <Form {...form}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fieldsValid = await trigger(undefined, { shouldFocus: true });
            fieldsValid &&
              modalStateContext.setModalState({
                isOpen: true,
                title:
                  confirmationModalTextCopies?.title || TEXT_COPIES.MODAL.title,
                message:
                  confirmationModalTextCopies?.description ||
                  TEXT_COPIES.MODAL.description,
                confirmText:
                  confirmationModalTextCopies?.confirmText ||
                  TEXT_COPIES.MODAL.confirmText,
                cancelText:
                  confirmationModalTextCopies?.cancelText ||
                  TEXT_COPIES.MODAL.cancelText,
                onConfirm: () => {
                  handleSubmit(onSubmit)();
                  modalStateContext.setModalState({ isOpen: false });
                },
                onCancel: () => {
                  modalStateContext.setModalState({ isOpen: false });
                },
              });
          }}
          className="space-y-8"
        >
          <section className="w-full flex flex-col gap-8">
            {loading ? (
              <>
                <Loading />
                <Loading />
              </>
            ) : (
              <>
                <BasicDetails fieldName={"basicDetails" as const} />
                {fields.map((field, sectionIndex) => {
                  switch (field.type) {
                    case SECTION.PROFESSIONAL_SUMMARY:
                      return (
                        <ProfessionalSummary
                          key={field.id}
                          deleteSection={() => {
                            deleteSection(sectionIndex);
                            optionallyTriggerValidationOnDelete();
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
                            optionallyTriggerValidationOnDelete();
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
                              optionallyTriggerValidationOnDelete();
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
                            optionallyTriggerValidationOnDelete();
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
                              optionallyTriggerValidationOnDelete();
                            }
                          }}
                        />
                      );
                    case SECTION.SKILLS:
                      return (
                        <Skills
                          key={field.id}
                          deleteSection={() => {
                            deleteSection(sectionIndex);
                            optionallyTriggerValidationOnDelete();
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
                                typeof skillsSectionSchema
                              >;
                              const currentFields = currentField?.fields;
                              const updatedFields = [...(currentFields || [])];
                              updatedFields.push({
                                skills: "",
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
                                typeof skillsSectionSchema
                              >;
                              const currentFields = currentField?.fields;
                              const updatedFields = [...(currentFields || [])];
                              updatedFields.splice(index, 1);
                              updateSection(sectionIndex, {
                                ...currentField,
                                fields: updatedFields,
                              });
                              optionallyTriggerValidationOnDelete();
                            }
                          }}
                        />
                      );
                    case SECTION.EDUCATION:
                      return (
                        <Education
                          key={field.id}
                          deleteSection={() => {
                            deleteSection(sectionIndex);
                            optionallyTriggerValidationOnDelete();
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
                                typeof educationSectionSchema
                              >;
                              const currentFields = currentField?.fields;
                              const updatedFields = [...(currentFields || [])];
                              updatedFields.push({
                                universityName: "",
                                degreeName: "",
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
                                typeof educationSectionSchema
                              >;
                              const currentFields = currentField?.fields;
                              const updatedFields = [...(currentFields || [])];
                              updatedFields.splice(index, 1);
                              updateSection(sectionIndex, {
                                ...currentField,
                                fields: updatedFields,
                              });
                              optionallyTriggerValidationOnDelete();
                            }
                          }}
                        />
                      );
                    case SECTION.ADDITIONAL:
                      return (
                        <Additional
                          key={field.id}
                          deleteSection={() => {
                            deleteSection(sectionIndex);
                            optionallyTriggerValidationOnDelete();
                          }}
                          index={sectionIndex}
                        />
                      );
                  }
                })}
              </>
            )}
          </section>
          {!loading && (
            <>
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
                  <DropdownMenuItem
                    data-add-section-menu-item="SKILLS"
                    onSelect={() => {
                      setFocusOnLastSection(true);
                      addSection(SECTION.SKILLS);
                    }}
                  >
                    Skills
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    data-add-section-menu-item="EDUCATION"
                    onSelect={() => {
                      setFocusOnLastSection(true);
                      addSection(SECTION.EDUCATION);
                    }}
                  >
                    Education
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    data-add-section-menu-item="ADDITIONAL"
                    onSelect={() => {
                      setFocusOnLastSection(true);
                      addSection(SECTION.ADDITIONAL);
                    }}
                  >
                    Additional
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="submit">Submit</Button>
            </>
          )}
        </form>
      </Form>
      <PopupDialog
        open={modalOpen}
        cancelText={modalCancelText || TEXT_COPIES.MODAL.cancelText}
        confirmText={modalConfirmText || TEXT_COPIES.MODAL.confirmText}
        description={modalMessage || TEXT_COPIES.MODAL.description}
        title={modalTitle || TEXT_COPIES.MODAL.title}
        onCancel={() => {
          modalOnCancel?.();
        }}
        onConfirm={() => {
          modalOnConfirm?.();
        }}
      />
    </ModalStateProvider>
  );
};
export default WrappedDynamicForm;
