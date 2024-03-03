"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/utils/firebase/config";
import {
  addUserData,
  getUserFromEmail,
} from "@/lib/utils/firebase/database/users";
import { useToast } from "@/components/ui/use-toast";
import { logout } from "@/components/auth/LogoutButton";

/**
 * Props for the GoogleJoinButton component.
 */
type GoogleJoinButtonProps = {
  isOtherOptionsLoading?: boolean;
  setGoogleAuthLoadingState?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Renders a button component for signing up/ logging in with Google.
 *
 */
const GoogleJoinButton: React.FC<GoogleJoinButtonProps> = ({
  isOtherOptionsLoading,
  setGoogleAuthLoadingState,
}) => {
  const [signInWithGoogle, , loadingGoogleAuth, errorGoogleAuth] =
    useSignInWithGoogle(auth);

  const { toast: displayToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setGoogleAuthLoadingState?.(loadingGoogleAuth);
  }, [loadingGoogleAuth]);

  /**
   * Handles the button click event for joining with Google.
   * - If there is any error during the joining process, it displays a toast with the relevant error message.
   * - If the joining process is successful, it authorises the user, adds the session token by using the internal API
   *  and adds the user data to the database (if the user already does not exist) before redirecting to the home page.
   * - If the joining process is unsuccessful, it logs out the user and displays a toast with the relevant error message.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {Error} If there is an error during the joining process.
   */
  const onButtonClick = async (): Promise<void> => {
    try {
      const res = await signInWithGoogle();
      if (errorGoogleAuth) {
        switch (errorGoogleAuth.code) {
          case "auth/account-exists-with-different-credential":
            throw new Error(
              "Account already exists with different credentials. Try logging in instead."
            );
          case "auth/credential-already-in-use":
            throw new Error("Account already exists. Try logging in instead.");
          default:
            throw new Error("Something went wrong.");
        }
      }
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

          router.refresh();
        }
        return;
      }
      throw new Error("Joining with Google failed");
    } catch (e: Error | any) {
      const errorMessage = e.message || "Joining with Google failed";
      displayToast({
        title: "An error has occurred while joining with Google!",
        description: errorMessage,
        variant: "destructive",
      });
      logout(router);
    }
  };

  return (
    <Button
      variant={"outline"}
      className="w-full max-w-72 text-md py-6 text-wrap"
      type="button"
      onClick={onButtonClick}
      disabled={isOtherOptionsLoading || loadingGoogleAuth}
    >
      <div className="flex items-center flex-wrap">
        <FaGoogle className="mr-2" /> Login with Google
      </div>
    </Button>
  );
};
export default GoogleJoinButton;
