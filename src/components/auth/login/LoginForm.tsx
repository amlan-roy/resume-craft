"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";
import { useLogin } from "@/lib/hooks/authentication/useLogin";
import { loginFormSchema, loginFormType } from "@/lib/types/auth";
import { auth } from "@/lib/utils/firebase/config";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import GoogleJoinButton from "@/components/auth/GoogleJoinButton";
import LoadingSkeleton from "@/components/auth/LoadingSkeleton";

type LoginFormProps = {
  hideForm?: boolean;
};

/**
 * LoginForm component for user authentication.
 *
 * @component
 * @param hideForm - Determines whether to hide the login form.
 * @returns The rendered LoginForm component.
 */
const LoginForm: React.FC<LoginFormProps> = ({ hideForm }) => {
  const form = useForm<loginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { toast: displayToast } = useToast();
  const {
    authState,
    useEmailAuth: emailAuth,
    useGoogleAuth: googleAuth,
  } = useLogin({
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

  const [componentLoading, setComponentLoading] = React.useState(true);

  useEffect(() => {
    setComponentLoading(false);
    if (authState === "authenticated") {
      // Not using router.push("/home") due to a cookie issue in prod environment
      // Refer: https://github.com/amlan-roy/resume-craft/issues/91 for more context
      router.refresh();
    }
  }, [authState, router]);

  /**
   * Handles the form submission for the login form.
   * - If there's an error during the login process, it displays a toast with the relevant error message.
   * - If the user's email is not verified, it logs out the user and displays a toast with the relevant error message.
   * - If the login process is successful, it authorises the user, adds the session token by using the internal API
   *  and redirects to the home page.
   *
   * @param data - The login form data containing the email and password.
   */
  const onSubmit = async (data: loginFormType) => {
    authState !== "loading" && emailAuth(data.email, data.password);
  };

  return (
    <>
      {componentLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {!hideForm && (
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
                    autoComplete="current-password"
                  ></Input>

                  {errors.password && (
                    <p className="text-sm font-medium text-destructive my-3">
                      {errors.password.message}
                    </p>
                  )}

                  <a
                    type="button"
                    href="/reset-password"
                    className="text-sm text-right ml-auto block mt-2 text-brand-primary-7 hover:underline"
                    title="Click here to reset your password"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="flex justify-center">
                  <Button
                    className="w-full max-w-72 text-md py-6"
                    type="submit"
                    disabled={
                      authState === "loading" || authState === "authenticated"
                    }
                  >
                    Login
                  </Button>
                </div>
              </form>
            </Form>
          )}
          <p className="my-4 text-center text-brand-neutral-7">OR</p>
          <div className="flex justify-center">
            <GoogleJoinButton
              isAuthInProgress={
                authState === "loading" || authState === "authenticated"
              }
              loginUsingGoogle={googleAuth}
            />
          </div>
        </>
      )}
    </>
  );
};
export default LoginForm;
