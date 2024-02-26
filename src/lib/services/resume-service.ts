import axios from "axios";
import { getIdToken } from "firebase/auth";
import { auth } from "../utils/firebase/config";

/**
 * Make a request to generate a resume
 * @param resumeData - The resume data
 * @param userId - The user id
 * @param fileName - The file name
 * @param mockTrue - Optional boolean to mock the request
 * @returns A promise that resolves to the response of the request
 **/
export const makeGenerateResumeRequest = async (
  resumeData: any,
  userId: string,
  fileName: string,
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
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
};
