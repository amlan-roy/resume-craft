import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

export type loginFormType = z.infer<typeof loginFormSchema>;
export type signupFormType = z.infer<typeof signupFormSchema>;
export type forgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;
