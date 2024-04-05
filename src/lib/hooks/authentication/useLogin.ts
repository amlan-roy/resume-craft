import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Auth, getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { logout } from "@/lib/services/auth/logout";
import { authStates } from "@/lib/types/hooks/authentication/auth";
import {
  addUserData,
  getUserFromEmail,
} from "@/lib/utils/firebase/database/users";

type TUseLoginProps = {
  auth: Auth;
  router?: ReturnType<typeof useRouter>;
  onError?: Function;
};

/**
 * A hook to log in the user.
 *
 * @param auth - Firebase Auth object.
 * @param router - Next.js router object. (Optional)
 * @param onError - Function to handle errors. (Optional)
 * @returns Object containing the current authentication state, an error message and functions to log in with email and password and with Google.
 */
export const useLogin = ({ auth, router, onError }: TUseLoginProps) => {
  const [authState, setAuthState] = useState<authStates>(() =>
    auth.currentUser ? "authenticated" : "unauthenticated"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [isEmailVerified, setIsEmailVerified] = useState(
    () => !!auth.currentUser?.emailVerified
  );

  const loginInProgress = authState === "loading";

  const [signInWithGoogle, , loadingGoogleAuth, errorGoogleAuth] =
    useSignInWithGoogle(auth);

  useEffect(() => {
    if (errorGoogleAuth) {
      setAuthState("error");
      let googleAuthErrorMessage =
        "An error occurred while logging in. Please try again.";
      switch (errorGoogleAuth.code) {
        case "auth/account-exists-with-different-credential":
          googleAuthErrorMessage =
            "Account already exists with different credentials. Try logging in instead.";
        case "auth/credential-already-in-use":
          googleAuthErrorMessage =
            "Account already exists. Try logging in instead.";
      }
      setErrorMessage(googleAuthErrorMessage);
    } else if (loadingGoogleAuth) {
      setErrorMessage(null);
      setAuthState("loading");
    } else if (["authenticated", "loading"].includes(authState)) {
      setErrorMessage(null);
    } else {
      setErrorMessage("An error occurred while logging in. Please try again.");
    }
  }, [authState, errorGoogleAuth, loadingGoogleAuth]);

  /**
   * Authenticates the user using email and password.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   */
  const useEmailAuth = async (email: string, password: string) => {
    if (loginInProgress) {
      console.error(
        "A login request is already in progress. Please wait while making another request..."
      );
      return;
    }
    try {
      setAuthState("loading");
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setIsEmailVerified(!!user?.emailVerified);

      const token = await getIdToken(user);

      if (!token) {
        await logout(auth, undefined, undefined, false);
        throw new Error(
          "There was an error while logging in. Please try again."
        );
      }

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
      } else {
        throw new Error("An error occurred while logging in");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      console.error("An error occurred while logging in: ", errorMessage);
      setAuthState("error");
      onError?.(error);
    }
  };

  /**
   * Authenticates the user using Google.
   */
  const useGoogleAuth = async () => {
    try {
      const res = await signInWithGoogle();
      if (res && res.user) {
        const response = await axios.post(
          "/api/login",
          {},
          {
            headers: {
              Authorization: `Bearer ${await res.user.getIdToken()}`,
            },
          }
        );

        if (response.status === 200) {
          const userExists = await getUserFromEmail(res.user.email || "");
          !userExists &&
            (await addUserData({
              name: res.user.displayName,
              email: res.user.email,
            }));
        } else {
          throw new Error("An error occurred while logging in");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      console.error("An error occurred while logging in: ", errorMessage);
      logout(auth, router, undefined, false);
      setAuthState("error");
      setErrorMessage(errorMessage);
      onError?.(error);
    }
  };

  return {
    authState,
    errorMessage,
    isEmailVerified,
    useEmailAuth,
    useGoogleAuth,
  };
};
