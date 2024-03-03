"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { getIdToken } from "firebase/auth";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@/lib/utils/firebase/config";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupFormSchema, signupFormType } from "@/lib/types/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import GoogleJoinButton from "@/components/auth/GoogleJoinButton";
import { addUserData } from "@/lib/utils/firebase/database/users";
import { logout } from "@/components/auth/LogoutButton";
import LoadingSkeleton from "../LoadingSkeleton";

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

  const [createUserWithEmailAndPassword, , loadingEmailAuth, errorEmailAuth] =
    useCreateUserWithEmailAndPassword(auth, {
      sendEmailVerification: true,
    });
  const [isGoogleLoginInProgress, setIsGoogleLoginInProgress] =
    React.useState(false);

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
    if (loadingEmailAuth || isGoogleLoginInProgress) return;
    try {
      const { user } =
        (await createUserWithEmailAndPassword(data.email, data.password)) || {};

      if (errorEmailAuth) {
        switch (errorEmailAuth.code) {
          case "auth/email-already-in-use":
            throw new Error("Email already in use.");
          case "auth/account-exists-with-different-credential":
            throw new Error("Account already exists. Try logging in insteed.");
          case "auth/credential-already-in-use":
            throw new Error(
              "Account already exists with a different sign in method."
            );
          default:
            throw new Error("User not created. Please try again later.");
        }
      }

      if (user) {
        await addUserData({
          name: user.displayName,
          email: user.email,
        });
        if (!user.emailVerified) {
          await logout(router, undefined, true);
          router.replace("/signup?emailSent=true");
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
          // Not using router.push("/home") due to a cookie issue in prod environment
          // Refer: https://github.com/amlan-roy/resume-craft/issues/91 for more context
          router.refresh();
          return;
        }
      }
      throw new Error("User not created");
    } catch (e: Error | any) {
      const errorMessage = e.message || "User not created";
      displayToast({
        title: "An error has occurred while creating your account!",
        description: errorMessage,
        variant: "destructive",
      });
      await logout(router, undefined, true);
    }
  };

  const [componentLoading, setComponentLoading] = React.useState(true);

  useEffect(() => {
    setComponentLoading(false);
  }, []);

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
                  disabled={loadingEmailAuth || isGoogleLoginInProgress}
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
          isOtherOptionsLoading={loadingEmailAuth}
          setGoogleAuthLoadingState={setIsGoogleLoginInProgress}
        />
      </div>
    </>
  );
};
export default SignupForm;
