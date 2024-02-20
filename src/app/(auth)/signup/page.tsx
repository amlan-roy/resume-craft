import React from "react";
import SignupForm from "@/components/auth/signup/SignupForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type SignupPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * Represents the Signup Page component.
 * - When emailSent query parameter is present, it shows a message that a confirmation email has been sent.
 * - Also when email sent query parameter is present, it hides the signup form but displays the google login option
 *
 * @param {object} props - The component props.
 * @param {object} props.searchParams - The search parameters object.
 * @returns {JSX.Element} - The rendered Signup Page component.
 */
const SignupPage: React.FC<SignupPageProps> = ({ searchParams }) => {
  const emailSent = searchParams?.["emailSent"];

  return (
    <div className="p-6">
      <Card className="border-0 shadow-none sm:border sm:shadow-sm sm:p-6 p-1 w-full sm:max-w-2xl mx-auto">
        <h1 className="text-brand-neutral-8 text-center text-4xl font-bold">
          Signup
        </h1>
        <p className="text-brand-neutral-8 text-center text-lg mt-4">
          Welcome to Resume Craft! Please signup to continue.
        </p>

        <>
          {emailSent && (
            <Card className="p-2 m-2 my-10 mb-4">
              <CardTitle className="text-lg">
                A confirmation email has been sent
              </CardTitle>
              <CardDescription>
                Follow the link sent in the email to activate your account and{" "}
                {""}
                <a
                  href="/login"
                  className="text-brand-primary-7 hover:underline font-semibold"
                >
                  Login
                </a>
                .
              </CardDescription>
            </Card>
          )}
          <SignupForm hideForm={!!emailSent} />
        </>

        <p className="mt-6 text-center text-wrap">
          Already have an account? Click here to{" "}
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
export default SignupPage;
