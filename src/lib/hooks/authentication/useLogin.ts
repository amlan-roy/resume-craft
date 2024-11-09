import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FirebaseError } from "firebase/app";
import { Auth, getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
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

type TUseLoginProps = {
  auth: Auth;
  router?: ReturnType<typeof useRouter>;
  onError?: Function;
  onSuccess?: Function;
};

/**
 * A hook to log in the user.
 *
 * @param auth - Firebase Auth object.
 * @param router - Next.js router object. (Optional)
 * @param onError - Function to handle errors. (Optional)
 * @param onSuccess - Function to handle successful login. (Optional)
 * @returns Object containing the current authentication state, an error message and functions to log in with email and password and with Google.
 */
export const useLogin = ({
  auth,
  router,
  onError,
  onSuccess,
}: TUseLoginProps) => {
  const [authState, setAuthState] = useState<authStates>(
    auth.currentUser ? "authenticated" : "unauthenticated"
  );
  const loginInProgress = authState === "loading";

  const [signInWithGoogle, , loadingGoogleAuth, errorGoogleAuth] =
    useSignInWithGoogle(auth);

  useEffect(() => {
    if (errorGoogleAuth) {
      setAuthState("error");
    } else if (loadingGoogleAuth) {
      setAuthState("loading");
    }
  }, [authState, errorGoogleAuth, loadingGoogleAuth]);

  // In case of expired session cookies, the get request to login api will return 401 with isLogged as false.
  //In such case, logout the user and set auth state as unauthenticated
  useEffect(() => {
    axios
      .get("/api/login")
      .then((res) => {
        if (auth.currentUser && !res.data?.isLogged) {
          setAuthState("loading");
          logout(auth, router, undefined, false).then(() =>
            setAuthState("unauthenticated")
          );
        }
      })
      .catch(() => {
        setAuthState("loading");
        logout(auth, router, undefined, false).then(() =>
          setAuthState("unauthenticated")
        );
      });
  }, []);

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

      const token = await getIdToken(user);

      if (!token) {
        throw new Error(ERROR_CODE.UNKNOWN);
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
        throw new Error(ERROR_CODE.UNKNOWN);
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

  /**
   * Authenticates the user using Google.
   */
  const useGoogleAuth = async () => {
    try {
      const res = await signInWithGoogle();
      if (!(res && res.user)) throw new Error(ERROR_CODE.UNKNOWN);

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
        throw new Error(ERROR_CODE.UNKNOWN);
      }
      setAuthState("authenticated");
      onSuccess?.();
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
    useEmailAuth,
    useGoogleAuth,
  };
};
