"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFormSchema, loginFormType } from "@/lib/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/utils/firebase/config";
import { useToast } from "@/components/ui/use-toast";
import { logout } from "@/components/auth/LogoutButton";
import GoogleJoinButton from "@/components/auth/GoogleJoinButton";

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
  const [loginInProgress, setLoginInProgress] = React.useState(false);
  const [isGoogleLoginInProgress, setIsGoogleLoginInProgress] =
    React.useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

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
    if (loginInProgress || isGoogleLoginInProgress) return;
    try {
      setLoginInProgress(true);
      const { user } =
        (await signInWithEmailAndPassword(auth, data.email, data.password)) ||
        {};

      if (!user.emailVerified) {
        await logout(router, undefined, true);
        displayToast({
          title: "Email not verified",
          description: "Please verify your email before logging in.",
          variant: "destructive",
        });
        setLoginInProgress(false);
        return;
      }

      const token = await getIdToken(user);

      if (!token) {
        await logout(router, undefined, true);
        throw new Error(
          "There was an error while logging in. Please try again."
        );
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
        router.push("/home");
        setLoginInProgress(false);
        return;
      }

      throw new Error(
        "An error has occurred while logging in to your account!"
      );
    } catch (e: Error | any) {
      console.error(e);
      await logout(router, undefined, true);
      let errorMessage = e.message || "Login unsuccessful";

      if (e.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please try again.";
      }
      displayToast({
        title: "An error has occurred while logging in to your account!",
        description: errorMessage,
        variant: "destructive",
      });
      setLoginInProgress(false);
    }
  };

  return (
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
                disabled={loginInProgress || isGoogleLoginInProgress}
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
          isOtherOptionsLoading={loginInProgress}
          setGoogleAuthLoadingState={setIsGoogleLoginInProgress}
        />
      </div>
    </>
  );
};
export default LoginForm;
