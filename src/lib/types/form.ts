import * as z from "zod";

export enum SECTION {
  ADDITIONAL = "ADDITIONAL",
  BASIC_DETAILS = "BASIC_DETAILS",
  EDUCATION = "EDUCATION",
  PROFESSIONAL_SUMMARY = "PROFESSIONAL_SUMMARY",
  PROJECTS = "PROJECTS",
  SKILLS = "SKILLS",
  WORK_EXPERIENCE = "WORK_EXPERIENCE",
}

export const durationFieldSchema = z
  .object({
    startDate: z.string().optional().nullish(),
    endDate: z.string().optional().nullish(),
    current: z.boolean().optional().nullish(),
  })
  .refine(
    (data) => {
      return !(data.endDate || !!data.current) || !!data.startDate;
    },
    (data) => {
      if (data.endDate) {
        return {
          message: "Start Date is required when you select an end date",
          path: ["startDate"],
        };
      }
      return {
        message: "Start Date is required when you select the current checkbox",
        path: ["startDate"],
      };
    }
  );

export type TDuration = {
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  current?: boolean | null | undefined;
};

export const basicDetailsFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().nullish().or(z.literal("")),
  phone: z.string().optional().nullish().or(z.literal("")),
  location: z.string().optional().nullish().or(z.literal("")),
  portfolioUrl: z
    .string()
    .url("Invalid URL. URL should be of the format: 'https://www.abcd.com'")
    .optional()
    .nullish()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url("Invalid URL. URL should be of the format: 'https://www.abcd.com'")
    .optional()
    .nullish()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Invalid URL. URL should be of the format: 'https://www.abcd.com'")
    .optional()
    .nullish()
    .or(z.literal("")),
  stackoverflowUrl: z
    .string()
    .url("Invalid URL. URL should be of the format: 'https://www.abcd.com'")
    .optional()
    .nullish()
    .or(z.literal("")),
  blogUrl: z
    .string()
    .url("Invalid URL. URL should be of the format: 'https://www.abcd.com'")
    .optional()
    .nullish()
    .or(z.literal("")),
});

export const workExperienceFieldSchema = z.object({
  jobTitle: z.string().min(1, "You need to enter the job title"),
  jobSubtitle: z.string().optional().nullish().or(z.literal("")),
  companyName: z.string().optional().nullish().or(z.literal("")),
  location: z.string().optional().nullish().or(z.literal("")),
  duration: durationFieldSchema.optional().nullish(),
  details: z
    .string()
    .min(1, "You need to enter the description of your job experience"),
});

export const projectsFieldSchema = z.object({
  projectTitle: z
    .string()
    .min(1, "You need to enter the title of your project"),
  projectSubtitle: z.string().optional().nullish().or(z.literal("")),
  projectUrl: z.string().optional().nullish().or(z.literal("")),
  associatedWith: z.string().optional().nullish().or(z.literal("")),
  duration: durationFieldSchema.optional().nullish(),
  details: z.string().optional().nullish().or(z.literal("")),
});
export const skillsFieldSchema = z.object({
  title: z.string().optional().nullish().or(z.literal("")),
  skills: z.string().min(1, "This is a required field"),
});

export const educationFieldSchema = z.object({
  universityName: z.string().min(1, "University Name is required"),
  degreeName: z.string().min(1, "Degree Name is required"),
  majorName: z.string().optional().nullish().or(z.literal("")),
  grade: z.string().optional().nullish().or(z.literal("")),
  location: z.string().optional().nullish().or(z.literal("")),
  duration: durationFieldSchema.optional().nullish(),
});

export const basicDetailsSectionSchema = z.object({
  type: z.literal(SECTION.BASIC_DETAILS),
  sectionTitle: z.string().min(1, "The section title is required"),
  fields: basicDetailsFieldSchema,
});
export const professionalSummarySectionSchema = z.object({
  type: z.literal(SECTION.PROFESSIONAL_SUMMARY),
  sectionTitle: z.string().min(1, "The section title is required"),
  fields: z.object({
    value: z.string().min(1, "You can not leave this field as empty"),
  }),
});
export const workExperienceSectionSchema = z.object({
  type: z.literal(SECTION.WORK_EXPERIENCE),
  sectionTitle: z.string().min(1, "The section title is required"),
  fields: z.array(workExperienceFieldSchema),
});
export const projectsSectionSchema = z.object({
  type: z.literal(SECTION.PROJECTS),
  sectionTitle: z.string().min(1, "The section title is required"),
  fields: z.array(projectsFieldSchema),
});
export const skillsSectionSchema = z.object({
  type: z.literal(SECTION.SKILLS),
  sectionTitle: z.string().min(1, "The section title is required"),
  fields: z.array(skillsFieldSchema),
});
export const educationSectionSchema = z.object({
  type: z.literal(SECTION.EDUCATION),
  sectionTitle: z.string().min(1, "The section title is required"),
  fields: z.array(educationFieldSchema),
});
export const additionalSectionSchema = z.object({
  type: z.literal(SECTION.ADDITIONAL),
  sectionTitle: z.string().min(1, "The section title is required"),
  fields: z.object({
    value: z.string().min(1, "This information is required"),
  }),
});

export const sectionTypes = z.union([
  professionalSummarySectionSchema,
  workExperienceSectionSchema,
  projectsSectionSchema,
  skillsSectionSchema,
  educationSectionSchema,
  additionalSectionSchema,
]);

export const formSchema = z.object({
  basicDetails: basicDetailsSectionSchema,
  optionalSections: z.array(sectionTypes),
});

export type formType = z.infer<typeof formSchema>;

export const resumeVariantGenerationFormSchema = z.object({
  jobDescription: z
    .string()
    .min(
      1,
      "It looks like you have missed to add the job description. A job description is required for generating a variant of your resume."
    ),
  modifiedResumeJSON: z
    .string()
    .min(1, "Please enter the JSON response from chat GPT"),
  customResumeName: z.string().optional().nullish().or(z.literal("")),
});
