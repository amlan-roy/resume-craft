import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FirebaseError } from "firebase/app";
import { Auth, getIdToken } from "firebase/auth";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import {
  ERROR_CODE,
  ERROR_MESSAGE,
} from "@/lib/const/hooks/authentication/errorMessages";
import { logout } from "@/lib/services/auth/logout";
import { authStates } from "@/lib/types/hooks/authentication/auth";
import {
  addUserData,
  getUserFromEmail,
} from "@/lib/utils/firebase/database/users";

type TUseSignupProps = {
  auth: Auth;
  router?: ReturnType<typeof useRouter>;
  onError?: Function;
  onSuccess?: Function;
};

/**
 * A hook to sign up the user.
 *
 * @param auth - Firebase Auth object.
 * @param router - Next.js router object. (Optional)
 * @param onError - Function to handle errors. (Optional)
 * @param onSuccess - Function to handle successful signup. (Optional)
 * @returns Object containing the current authentication state, an error message and functions to sign up with email and password and with Google.
 */
export const useSignup = ({
  auth,
  router,
  onError,
  onSuccess,
}: TUseSignupProps) => {
  const [authState, setAuthState] = useState<authStates>(() =>
    auth.currentUser ? "authenticated" : "unauthenticated"
  );

  const signupInProgress = authState === "loading";

  const [signInWithGoogle, , loadingGoogleAuth, errorGoogleAuth] =
    useSignInWithGoogle(auth);

  const [createUserWithEmailAndPassword, , loadingEmailAuth, errorEmailAuth] =
    useCreateUserWithEmailAndPassword(auth, {
      sendEmailVerification: true,
    });

  useEffect(() => {
    if (errorGoogleAuth) {
      setAuthState("error");
    } else if (errorEmailAuth) {
      setAuthState("error");
    } else if (loadingGoogleAuth || loadingEmailAuth) {
      setAuthState("loading");
    }
  }, [
    authState,
    errorGoogleAuth,
    loadingGoogleAuth,
    loadingEmailAuth,
    errorEmailAuth,
  ]);

  /**
   * Authenticates the user using email and password.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   */
  const signupWithEmail = async (email: string, password: string) => {
    if (signupInProgress) {
      console.info(
        "A signup request is already in progress. Please wait while making another request..."
      );
      return;
    }
    try {
      setAuthState("loading");
      const { user } =
        (await createUserWithEmailAndPassword(email, password)) || {};

      if (!user) {
        throw new Error(
          "An error occurred while signing up. Please try again."
        );
      }

      const userExists = await getUserFromEmail(user.email || "");
      !userExists &&
        (await addUserData({
          name: user.displayName,
          email: user.email,
        }));

      const token = await getIdToken(user);

      const response = await axios.post(
        "/api/login",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAuthState("authenticated");
        onSuccess?.();
        return;
      }

      throw new Error("An error occurred while signing up. Please try again.");
    } catch (error: Error | FirebaseError | any) {
      const errorCode =
        (Object.values(ERROR_CODE).includes(error.code) && error.code) ||
        ERROR_CODE.UNKNOWN;

      const errorTitle = ERROR_MESSAGE[errorCode].title;
      const errorBody = ERROR_MESSAGE[errorCode].message;

      console.error(
        "An error occurred while logging in: ",
        error.message || errorBody
      );
      onError?.(error, errorTitle, errorBody);
      await logout(auth, router, undefined, false);
      setAuthState("error");
    }
  };

  /**
   * Authenticates the user using Google.
   */
  const signupWithGoogle = async () => {
    try {
      const res = await signInWithGoogle();

      const { user } = res || {};

      if (user) {
        const response = await axios.post(
          "/api/login",
          {},
          {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          }
        );

        if (response.status === 200) {
          const userExists = await getUserFromEmail(user.email || "");
          !userExists &&
            (await addUserData({
              name: user.displayName,
              email: user.email,
            }));
          setAuthState("authenticated");
          onSuccess?.();
        } else {
          throw new Error("An error occurred while logging in");
        }
      } else {
        throw new Error("An error occurred while logging in");
      }
    } catch (error: Error | FirebaseError | any) {
      const errorCode =
        (Object.values(ERROR_CODE).includes(error.code) && error.code) ||
        ERROR_CODE.UNKNOWN;

      const errorTitle = ERROR_MESSAGE[errorCode].title;
      const errorBody = ERROR_MESSAGE[errorCode].message;

      console.error(
        "An error occurred while logging in: ",
        error.message || errorBody
      );
      onError?.(error, errorTitle, errorBody);
      await logout(auth, router, undefined, false);
      setAuthState("error");
    }
  };

  return {
    authState,
    signupWithEmail,
    signupWithGoogle,
  };
};
