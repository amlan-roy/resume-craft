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

type ResetPasswordFormProps = {};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = () => {
  const form = useForm<forgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: forgotPasswordFormType) => {
    console.log(data);
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
