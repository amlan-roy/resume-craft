import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Auth, getIdToken } from "firebase/auth";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
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
};

/**
 * A hook to sign up the user.
 *
 * @param auth - Firebase Auth object.
 * @param router - Next.js router object. (Optional)
 * @param onError - Function to handle errors. (Optional)
 * @returns Object containing the current authentication state, an error message and functions to sign up with email and password and with Google.
 */
export const useSignup = ({ auth, router, onError }: TUseSignupProps) => {
  const [authState, setAuthState] = useState<authStates>(() =>
    auth.currentUser ? "authenticated" : "unauthenticated"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>("");

  const signupInProgress = authState === "loading";

  const [signInWithGoogle, , loadingGoogleAuth, errorGoogleAuth] =
    useSignInWithGoogle(auth);

  const [createUserWithEmailAndPassword, , loadingEmailAuth, errorEmailAuth] =
    useCreateUserWithEmailAndPassword(auth, {
      sendEmailVerification: true,
    });

  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(() =>
    auth.currentUser ? !!auth.currentUser.emailVerified : null
  );

  useEffect(() => {
    if (errorGoogleAuth) {
      setAuthState("error");
      setIsEmailVerified(null);
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
    } else if (errorEmailAuth) {
      setAuthState("error");
      setIsEmailVerified(null);

      let emailAuthErrorMessage =
        "An error occurred while signing up. Please try again.";

      switch (errorEmailAuth.code) {
        case "auth/email-already-in-use":
          emailAuthErrorMessage = "Email already in use.";
        case "auth/account-exists-with-different-credential":
          emailAuthErrorMessage =
            "Account already exists. Try logging in insteed.";
        case "auth/credential-already-in-use":
          emailAuthErrorMessage =
            "Account already exists with a different sign in method.";
        default:
          emailAuthErrorMessage = "User not created. Please try again later.";
      }
      setErrorMessage(emailAuthErrorMessage);
    } else if (loadingGoogleAuth || loadingEmailAuth) {
      setErrorMessage(null);
      setIsEmailVerified(null);
      setAuthState("loading");
    } else if (["authenticated", "loading"].includes(authState)) {
      setErrorMessage(null);
      authState == "loading" && setIsEmailVerified(null);
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
  const signupWithEmail = async (
    email: string,
    password: string,
    logoutIfEmailNotVerified?: boolean
  ) => {
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

      setIsEmailVerified(!!user?.emailVerified);

      const userExists = await getUserFromEmail(user.email || "");
      !userExists &&
        (await addUserData({
          name: user.displayName,
          email: user.email,
        }));
      if (logoutIfEmailNotVerified && !user.emailVerified) {
        await logout(auth, router, undefined, false);
        setAuthState("unauthenticated");
        return;
      }

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
        return;
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
  const signupWithGoogle = async (logoutIfEmailNotVerified?: boolean) => {
    try {
      const res = await signInWithGoogle();

      const { user } = res || {};

      if (res && user) {
        setIsEmailVerified(!!user?.emailVerified);

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

          if (logoutIfEmailNotVerified && !user.emailVerified) {
            await logout(auth, router, undefined, false);
            setAuthState("unauthenticated");
            setIsEmailVerified(false);
            return;
          }

          setAuthState("authenticated");
        } else {
          throw new Error("An error occurred while logging in");
        }
      } else {
        throw new Error("An error occurred while logging in");
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
    signupWithEmail,
    signupWithGoogle,
  };
};
