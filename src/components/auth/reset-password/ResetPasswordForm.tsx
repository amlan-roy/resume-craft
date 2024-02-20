"use client";
import React from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordFormSchema,
  forgotPasswordFormType,
} from "@/lib/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/utils/firebase/config";
import { useToast } from "@/components/ui/use-toast";

type ResetPasswordFormProps = {};

/**
 * ResetPasswordForm component.
 *
 * This component renders a form for resetting the user's password.
 * It uses the useForm hook from react-hook-form library to handle form validation and submission.
 * The form includes an email input field and a submit button.
 * When the form is submitted, it calls the sendPasswordResetEmail function to send a password reset email.
 * If an error occurs during the password reset process, an error toast is displayed.
 *
 * @returns JSX.Element
 */
const ResetPasswordForm: React.FC<ResetPasswordFormProps> = () => {
  const form = useForm<forgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const { toast: displayToast } = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  /**
   * Handles the form submission for resetting the password.
   * - If there's an error during the password reset process, it displays a toast with the relevant error message.
   * - If the password reset process is successful, it redirects to the reset password page with a query parameter to indicate that the email has been sent.
   *
   * @param data - The form data containing the email.
   */
  const onSubmit = async (data: forgotPasswordFormType) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      router.replace("/reset-password?emailSent=true");
    } catch (e: Error | any) {
      let errorMessage = e.message || "Password reset failed!";

      displayToast({
        title:
          "An error has occurred while resetting your password! Please try again.",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  return (
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
        <div className="flex justify-center">
          <Button className="w-full max-w-72 text-md py-6" type="submit">
            Reset Password
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ResetPasswordForm;
