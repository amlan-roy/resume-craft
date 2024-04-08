import React from "react";
import { Card, CardDescription } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "@/components/auth/reset-password/ResetPasswordForm";

type ResetPasswordPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  searchParams,
}) => {
  const emailSent = searchParams?.["emailSent"];

  return (
    <div className="p-6">
      <Card className="border-0 shadow-none sm:border sm:shadow-sm sm:p-6 p-1 w-full sm:max-w-2xl mx-auto">
        <h1 className="text-brand-neutral-8 text-center text-4xl font-bold">
          Forgot Password?
        </h1>
        <p className="text-brand-neutral-8 text-center text-lg mt-4">
          No worries. Happens with the best of us. <br />
          Enter your email to reset your password.
        </p>

        <>
          {emailSent ? (
            <Card className="p-2 m-2 my-10 mb-4">
              <CardTitle className="text-lg">
                A reset password email has been sent to the entered email id
              </CardTitle>
              <CardDescription>
                Follow the link sent in the email to reset your password and log
                in.
              </CardDescription>
            </Card>
          ) : (
            <ResetPasswordForm />
          )}
        </>
        <p className="mt-6 text-center text-wrap">
          Remembered the password? Click here to{" "}
          <a
            href="/login"
            className="text-brand-primary-7 hover:underline font-semibold"
          >
            Login
          </a>
        </p>
      </Card>
    </div>
  );
};
export default ResetPasswordPage;
