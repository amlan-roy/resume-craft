import {
  SECTION,
  additionalSectionSchema,
  basicDetailsSectionSchema,
  educationSectionSchema,
  professionalSummarySectionSchema,
  projectsSectionSchema,
  skillsSectionSchema,
  workExperienceSectionSchema,
} from "@/lib/types/form";
import { z } from "zod";

export const DEFAULT_BASIC_DETAILS_FORM_VALUE: z.infer<
  typeof basicDetailsSectionSchema
> = {
  type: SECTION.BASIC_DETAILS,
  sectionTitle: "Basic Details",
  fields: {
    name: "",
  },
};

export const DEFAULT_PROFESSIONAL_SUMMARY_FORM_VALUE: z.infer<
  typeof professionalSummarySectionSchema
> = {
  type: SECTION.PROFESSIONAL_SUMMARY,
  sectionTitle: "Professional Summary",
  fields: {
    value: "",
  },
};

export const DEFAULT_WORK_EXPERIENCE_FORM_VALUE: z.infer<
  typeof workExperienceSectionSchema
> = {
  type: SECTION.WORK_EXPERIENCE,
  sectionTitle: "Work Experience",
  fields: [{ jobTitle: "", details: "", companyName: "", location: "" }],
};
export const DEFAULT_PROJECTS_FORM_VALUE: z.infer<
  typeof projectsSectionSchema
> = {
  type: SECTION.PROJECTS,
  sectionTitle: "Relevant Projects",
  fields: [
    {
      projectTitle: "",
      projectSubtitle: "",
      projectUrl: undefined,
      associatedWith: undefined,
      details: "",
    },
  ],
};
export const DEFAULT_SKILLS_FORM_VALUE: z.infer<typeof skillsSectionSchema> = {
  type: SECTION.SKILLS,
  sectionTitle: "Technical Skills",
  fields: [
    {
      skills: "",
    },
  ],
};
export const DEFAULT_EDUCATION_FORM_VALUE: z.infer<
  typeof educationSectionSchema
> = {
  type: SECTION.EDUCATION,
  sectionTitle: "Education",
  fields: [
    {
      universityName: "",
      degreeName: "",
      majorName: "",
      grade: "",
      location: "",
    },
  ],
};
export const DEFAULT_ADDITIONAL_FORM_VALUE: z.infer<
  typeof additionalSectionSchema
> = {
  type: SECTION.ADDITIONAL,
  sectionTitle: "Additional Information",
  fields: {
    value: "",
  },
};

export const DEFAULT_FORM_VALUE = {
  basicDetails: DEFAULT_BASIC_DETAILS_FORM_VALUE,
  optionalSections: [
    DEFAULT_PROFESSIONAL_SUMMARY_FORM_VALUE,
    DEFAULT_WORK_EXPERIENCE_FORM_VALUE,
    DEFAULT_PROJECTS_FORM_VALUE,
    DEFAULT_SKILLS_FORM_VALUE,
    DEFAULT_EDUCATION_FORM_VALUE,
    DEFAULT_ADDITIONAL_FORM_VALUE,
  ],
};
