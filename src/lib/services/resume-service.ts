import axios from "axios";
import { getIdToken } from "firebase/auth";
import { auth, db } from "../utils/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Make a request to generate a resume
 * @param resumeData - The resume data
 * @param userId - The user id
 * @param fileName - The file name
 * @param formId - The form id
 * @param mockTrue - Optional boolean to mock the request
 * @returns A promise that resolves to the response of the request
 **/
export const makeGenerateResumeRequest = async (
  resumeData: any,
  userId: string,
  fileName: string,
  formId: string,
  mockTrue?: boolean
) => {
  const idToken = auth.currentUser && (await getIdToken(auth.currentUser));
  if (!idToken) {
    throw new Error("User not authenticated");
  }
  return axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/data-formatting?action=generateResume${mockTrue ? "&mockTrue=true" : ""}`,
    {
      resumeData,
      userId,
      fileName,
      formId,
      isBase: formId === "base",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
};

/**
 * Make a request to save a resume
 * @param resumeData - The resume data
 * @param userId - The user id
 * @param formId - The form id
 * @returns A promise that resolves to the response of the request
 **/
export const saveResumeData = async (
  resumeData: any,
  userId: string,
  formId: string
) => {
  const documentRef = doc(db, "users", userId);

  if (!documentRef) {
    throw new Error("User not found");
  }

  if (formId === "base") {
    await setDoc(
      documentRef,
      {
        baseResumeData: {
          formData: resumeData,
          timeUpdated: new Date().toISOString(),
          formId: "base",
        },
      },
      { merge: true }
    );
  } else {
    const currentResumeVariantData = await getResumeVariantData(userId);
    await setDoc(
      documentRef,
      {
        resumeVariantData: {
          ...currentResumeVariantData,
          [formId]: {
            formData: resumeData,
            timeUpdated: new Date().toISOString(),
            formId,
          },
        },
      },
      { merge: true }
    );
  }

  await setDoc(
    documentRef,
    {
      ...(formId === "base"
        ? {
            baseResumeData: {
              formData: resumeData,
              timeUpdated: new Date().toISOString(),
              formId: "base",
            },
          }
        : {}),
    },
    { merge: true }
  );
};

/**
 * Get the base resume data
 * @param userId - The user id
 * @returns A promise that resolves to the base resume data
 **/
export const getBaseResumeData = async (userId: string) => {
  const documentRef = doc(db, "users", userId);

  if (!documentRef) {
    throw new Error("User not found");
  }

  const docData = await getDoc(documentRef);
  const { baseResumeData } = docData.data() || {};

  return baseResumeData;
};

export const setBaseResumeData = async (userId: string, resumeData: any) => {
  const documentRef = doc(db, "users", userId);

  if (!documentRef) {
    throw new Error("User not found");
  }

  await setDoc(
    documentRef,
    {
      baseResumeData: {
        formData: resumeData,
        timeUpdated: new Date().toISOString(),
        formId: "base",
      },
    },
    { merge: true }
  );
};

export const getResumeVariantData = async (userId: string) => {
  const documentRef = doc(db, "users", userId);

  if (!documentRef) {
    throw new Error("User not found");
  }

  const docData = await getDoc(documentRef);
  const { resumeVariantData } = docData.data() || {};

  return resumeVariantData;
};

/**
 * Get the resume form data
 * @param userId - The user id
 * @param formId - The form id (use "base" for the base resume, or the form id for a variant resume)
 * @returns A promise that resolves to the resume form data
 */
export const getResumeFormData = async (userId: string, formId: string) => {
  const documentRef = doc(db, "users", userId);

  if (!documentRef) {
    throw new Error("User not found");
  }

  const docData = await getDoc(documentRef);
  const { resumeVariantData, baseResumeData } = docData.data() || {};

  if (formId === "base") {
    return baseResumeData?.formData;
  }

  return resumeVariantData?.[formId]?.formData;
};

/**
 * Set the resume form data
 * @param userId - The user id
 * @param formId - The form id (use "base" for the base resume, or the form id for a variant resume)
 * @param resumeData - The resume form data
 * @returns A promise that resolves to the response of the request
 **/
export const setResumeFormData = async (
  userId: string,
  formId: string,
  resumeData: any
) => {
  const documentRef = doc(db, "users", userId);

  if (!documentRef) {
    throw new Error("User not found");
  }

  const partialDocDataToSet =
    formId === "base"
      ? {
          baseResumeData: {
            formData: resumeData,
            timeUpdated: new Date().toISOString(),
            formId: "base",
          },
        }
      : {
          resumeVariantData: {
            [formId]: {
              ...(await getResumeFormData(userId, formId)),
              formData: resumeData,
              timeUpdated: new Date().toISOString(),
              formId,
            },
          },
        };

  await setDoc(documentRef, partialDocDataToSet, { merge: true });
};

export const deleteResume = async (userId: string, formId: string) => {
  const idToken = auth.currentUser && (await getIdToken(auth.currentUser));
  if (!idToken) {
    throw new Error("User not authenticated");
  }
  const documentRef = doc(db, "users", userId);

  if (!documentRef) {
    throw new Error("User not found");
  }

  const resumeVariantData =
    formId === "base" ? await getResumeVariantData(userId) : {};

  const fileName = resumeVariantData[formId]?.downloadFileName;

  await axios.delete(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/data-formatting?formId=${formId}}${fileName ? `&fileName=${fileName}` : ""}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  delete resumeVariantData?.[formId];

  await setDoc(
    documentRef,
    {
      ...(formId === "base"
        ? {
            baseResumeData: {
              downloadFileName: null,
              downloadUrl: null,
              timeUpdated: null,
            },
          }
        : {
            resumeVariantData,
          }),
    },
    { merge: true }
  );
};
