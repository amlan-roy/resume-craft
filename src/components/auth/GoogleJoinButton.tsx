"use client";

import React from "react";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

/**
 * Props for the GoogleJoinButton component.
 */
type GoogleJoinButtonProps = {
  isAuthInProgress?: boolean;
  loginUsingGoogle?: Function;
};

/**
 * Renders a button component for signing up/ logging in with Google.
 *
 */
const GoogleJoinButton: React.FC<GoogleJoinButtonProps> = ({
  isAuthInProgress,
  loginUsingGoogle,
}) => {
  const onButtonClick = async (): Promise<void> => {
    await loginUsingGoogle?.();
  };

  return (
    <Button
      variant={"outline"}
      className="w-full max-w-72 text-md py-6 text-wrap"
      type="button"
      onClick={onButtonClick}
      disabled={isAuthInProgress}
    >
      <div className="flex items-center flex-wrap">
        <FaGoogle className="mr-2" /> Login with Google
      </div>
    </Button>
  );
};
export default GoogleJoinButton;
