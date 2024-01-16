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

export const durationFieldSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  current: z.boolean().optional(),
});

export const basicDetailsFieldSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  portfolioUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  stackoverflowUrl: z.string().url().optional(),
  blogUrl: z.string().url().optional(),
});
export const workExperienceFieldSchema = z.object({
  jobTitle: z.string(),
  companyName: z.string().optional(),
  location: z.string().optional(),
  duration: durationFieldSchema.optional(),
  details: z.string(),
});
export const projectsFieldSchema = z.object({
  projectTitle: z.string(),
  projectUrl: z.string().optional(),
  associatedWith: z.string().optional(),
  duration: durationFieldSchema.optional(),
  details: z.string().optional(),
});
export const skillsFieldSchema = z.union([
  z
    .object({
      title: z.string(),
      skills: z.string(),
    })
    .optional(),
  z.string().optional(),
]);
export const educationFieldSchema = z.object({
  universityName: z.string(),
  degreeName: z.string(),
  majorName: z.string().optional(),
  grade: z.string().optional(),
  location: z.string().optional(),
  duration: durationFieldSchema.optional(),
});

export const basicDetailsSectionSchema = z.object({
  type: z.literal(SECTION.BASIC_DETAILS),
  sectionTitle: z.string(),
  fields: basicDetailsFieldSchema,
});
export const professionalSummarySectionSchema = z.object({
  type: z.literal(SECTION.PROFESSIONAL_SUMMARY),
  sectionTitle: z.string().min(1),
  fields: z.object({
    value: z.string().min(1),
  }),
});
export const workExperienceSectionSchema = z.object({
  type: z.literal(SECTION.WORK_EXPERIENCE),
  sectionTitle: z.string(),
  fields: z.array(workExperienceFieldSchema),
});
export const projectsSectionSchema = z.object({
  type: z.literal(SECTION.PROJECTS),
  sectionTitle: z.string(),
  fields: z.array(projectsFieldSchema),
});
export const skillsSectionSchema = z.object({
  type: z.literal(SECTION.SKILLS),
  sectionTitle: z.string(),
  fields: z.array(skillsFieldSchema),
});
export const educationSectionSchema = z.object({
  type: z.literal(SECTION.EDUCATION),
  sectionTitle: z.string(),
  fields: z.array(educationFieldSchema),
});
export const additionalSectionSchema = z.object({
  type: z.literal(SECTION.ADDITIONAL),
  sectionTitle: z.string(),
  fields: z.object({
    value: z.string(),
  }),
});

export const formSchema = z.object({
  basicDetails: basicDetailsSectionSchema,
  optionalSections: z.array(
    z.union([
      professionalSummarySectionSchema,
      workExperienceSectionSchema,
      projectsSectionSchema,
      skillsSectionSchema,
      educationSectionSchema,
      additionalSectionSchema,
    ])
  ),
});
