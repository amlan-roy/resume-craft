import React from "react";
import { Button } from "@/components/ui/button";

type EmailVerificationBannerProps = {
  onDismiss?: Function;
};

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
  onDismiss,
}) => {
  return (
    <div className="bg-brand-neutral-5 text-brand-neutral-9 p-4 flex flex-row items-center">
      <p className="text-center w-full text-wrap">
        Your email is not verified. Please verify your email to access all
        features. Check your inbox for verification email.
      </p>
      {onDismiss && (
        <Button variant={"ghost"} onClick={() => onDismiss?.()}>
          X
        </Button>
      )}
    </div>
  );
};
export default EmailVerificationBanner;
