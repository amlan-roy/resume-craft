import { formType } from "@/lib/types/form";
import { db, auth } from "@/lib/utils/firebase/config";
import {
  collection,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  DocumentSnapshot,
  doc,
} from "firebase/firestore";

/**
 * Adds user data to the Firestore database.
 * @param  userData - The user data to be added.
 * @param userData.name - The name of the user.
 * @param  userData.email - The email of the user.
 * @param userData.documents - Optional array of user documents.
 * @returns A promise that resolves to the document snapshot of the added user data, or undefined if the user is not authenticated.
 */
export const addUserData = async ({
  name,
  email,
  documents,
}: {
  name?: string | null;
  email: string | null;
  documents?: {
    downloadUrl?: string;
    formData: formType;
    downloadFileName?: string;
    timeUpdated?: string;
  }[];
}): Promise<DocumentSnapshot | null> => {
  const usersRef = collection(db, "users");
  const newUser = {
    name,
    email,
  };

  const userId = auth.currentUser?.uid;
  if (!userId) {
    return null;
  }

  const documentRef = doc(db, "users", userId);
  await setDoc(documentRef, newUser);

  const docRefData = await getDoc(documentRef);

  return docRefData;
};

/**
 * Retrieves a user document from the Firestore database based on the email.
 * @param email - The email of the user to retrieve.
 * @returns A promise that resolves to the document snapshot of the retrieved user.
 */
export const getUserFromEmail = async (
  email: string
): Promise<DocumentSnapshot> => {
  const usersRef = collection(db, "users");
  const queryRef = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs[0];
};
