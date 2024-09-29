import { formType } from "./form";

export type UserDocumentData = {
  name: string;
  email: string;
  baseResumeData: UserDocumentBaseResumeData;
  resumeVariantData: ResumeVariantData;
  credits?: number;
};

export type UserDocumentBaseResumeData = {
  formId: "base";
} & UserDocumentResumeVariantData;

export type UserDocumentResumeVariantData = {
  downloadFileName?: string;
  downloadUrl?: string;
  formData: formType;
  formId: string;
  timeUpdated?: string;
};

export type ResumeVariantData = {
  [key: string]: UserDocumentResumeVariantData;
};
