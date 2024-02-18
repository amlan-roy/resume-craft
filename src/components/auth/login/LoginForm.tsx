"use client";
import React from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFormSchema, loginFormType } from "@/lib/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type LoginFormProps = {};

const LoginForm: React.FC<LoginFormProps> = () => {
  const form = useForm<loginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: loginFormType) => {
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
          <Button className="w-full max-w-72 text-md py-6" type="submit">
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default LoginForm;
