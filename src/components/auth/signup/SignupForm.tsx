"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";
import { useSignup } from "@/lib/hooks/authentication/useSignup";
import { signupFormSchema, signupFormType } from "@/lib/types/auth";
import { auth } from "@/lib/utils/firebase/config";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import GoogleJoinButton from "@/components/auth/GoogleJoinButton";
import LoadingSkeleton from "@/components/auth/LoadingSkeleton";

type SignupFormProps = {
  hideForm?: boolean;
};

/**
 * SignupForm component for user registration.
 *
 * @component
 * @param  props - The component props.
 * @param  props.hideForm - Optional boolean to hide the signup form.
 * @returns  The rendered SignupForm component.
 */
const SignupForm: React.FC<SignupFormProps> = ({ hideForm }) => {
  const form = useForm<signupFormType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { toast: displayToast } = useToast();

  const { authState, signupWithEmail, signupWithGoogle } = useSignup({
    auth,
    router,
    onError: (
      error: Error | FirebaseError | any,
      errorTitle = "An error occurred",
      errorMessage = "Please try again later!"
    ) => {
      displayToast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  /**
   * Handles the form submission for signing up a user.
   * - If there's an error during the signup process, it displays a toast with the relevant error message.
   * - If the signup process is successful, it authorises the user, adds the session token by using the internal API
   *  and adds the user data to the database before redirecting to the home page.
   * - If the signup process is unsuccessful, it logs out the user and displays a toast with the relevant error message.
   *
   * @param data - The form data containing the email and password.
   */
  const onSubmit = async (data: signupFormType) => {
    authState !== "loading" && signupWithEmail(data.email, data.password);
  };

  const [componentLoading, setComponentLoading] = React.useState(true);

  useEffect(() => {
    setComponentLoading(false);
    if (authState === "authenticated") {
      // Not using router.push("/home") due to a cookie issue in prod environment
      // Refer: https://github.com/amlan-roy/resume-craft/issues/91 for more context
      router.refresh();
    }
  }, [authState, router]);

  return componentLoading ? (
    <LoadingSkeleton inputCount={3} />
  ) : (
    <>
      {!hideForm && (
        <>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 mt-8"
            >
              <div>
                <Label className="text-md">Email</Label>
                <Input
                  {...register("email")}
                  placeholder="youremail@gmail.com"
                  type="email"
                  autoComplete="email"
                ></Input>
                {errors.email && (
                  <p className="text-sm font-medium text-destructive my-3">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-md">Password</Label>
                <Input
                  {...register("password")}
                  placeholder="*********"
                  type="password"
                  autoComplete="new-password"
                ></Input>

                {errors.password && (
                  <p className="text-sm font-medium text-destructive my-3">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-md">Confirm Password</Label>
                <Input
                  {...register("confirmPassword")}
                  placeholder="*********"
                  type="password"
                ></Input>

                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-destructive my-3">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex justify-center">
                <Button
                  className="w-full max-w-72 text-md py-6"
                  type="submit"
                  disabled={authState === "loading"}
                >
                  Signup
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
      <p className="my-4 text-center text-brand-neutral-7">OR</p>
      <div className="flex justify-center">
        <GoogleJoinButton
          isAuthInProgress={authState === "loading"}
          loginUsingGoogle={signupWithGoogle}
        />
      </div>
    </>
  );
};
export default SignupForm;
