import { formType } from "@/lib/types/form";
import { db } from "@/lib/utils/firebase/config";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  DocumentSnapshot,
} from "firebase/firestore";

/**
 * Adds user data to the Firestore database.
 * @param {Object} userData - The user data to be added.
 * @param {string | null} userData.name - The name of the user.
 * @param {string | null} userData.email - The email of the user.
 * @param {{ downloadUrl?: string; formData: formType }[]} [userData.documents] - Optional array of user documents.
 * @returns {Promise<DocumentSnapshot>} A promise that resolves to the document snapshot of the added user data.
 */
export const addUserData = async ({
  name,
  email,
  documents,
}: {
  name?: string | null;
  email: string | null;
  documents?: { downloadUrl?: string; formData: formType }[];
}): Promise<DocumentSnapshot> => {
  const usersRef = collection(db, "users");
  const newUser = {
    name,
    email,
  };

  const docRef = await addDoc(usersRef, newUser);

  const docRefData = await getDoc(docRef);

  return docRefData;
};

/**
 * Retrieves a user document from the Firestore database based on the email.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<DocumentSnapshot>} A promise that resolves to the document snapshot of the retrieved user.
 */
export const getUserFromEmail = async (
  email: string
): Promise<DocumentSnapshot> => {
  const usersRef = collection(db, "users");
  const queryRef = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs[0];
};
