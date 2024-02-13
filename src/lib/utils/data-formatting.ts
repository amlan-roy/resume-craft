import { formType } from "@/lib/types/form";

/**
 * Function that takes in the form data, removes the undefined, null, empty strings and empty objects from the form data and returns the formatted data
 * @param values
 * @returns
 */
export function cleanFormData(values: Object) {
  return JSON.parse(JSON.stringify(values, replaceEmptyValues));
}

/**
 * Helper function passed to JSON.stringify function, that removes undefined, null, empty objects and empty strings from the passed JSON object
 */
function replaceEmptyValues(key: any, value: any) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (value === Object(value) && Object.keys(value).length === 0)
  ) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.filter(
      (item) => item !== null && item !== undefined && item !== ""
    );
  }

  return value;
}

export const removeSensitiveInformation = (resumeData: formType) => {
  const retData = JSON.parse(JSON.stringify(resumeData)) as formType;

  const {
    email,
    phone,
    location,
    portfolioUrl,
    githubUrl,
    linkedinUrl,
    stackoverflowUrl,
    blogUrl,
  } = retData.basicDetails.fields;

  retData.basicDetails.fields = {
    name: "SENSITIVE DATA",
    ...(email && { email: "SENSITIVE DATA" }),
    ...(phone && { phone: "SENSITIVE DATA" }),
    ...(location && { location: "SENSITIVE DATA" }),
    ...(portfolioUrl && { portfolioUrl: "SENSITIVE DATA" }),
    ...(githubUrl && { githubUrl: "SENSITIVE DATA" }),
    ...(linkedinUrl && { linkedinUrl: "SENSITIVE DATA" }),
    ...(stackoverflowUrl && { stackoverflowUrl: "SENSITIVE DATA" }),
    ...(blogUrl && { blogUrl: "SENSITIVE DATA" }),
  };
  return retData;
};

export const addBackSensitiveInformation = (
  filteredFormData: formType,
  originalFormData: formType
) => {
  const retData = JSON.parse(JSON.stringify(filteredFormData)) as formType;

  retData.basicDetails = JSON.parse(
    JSON.stringify(originalFormData.basicDetails)
  );
  return retData;
};
