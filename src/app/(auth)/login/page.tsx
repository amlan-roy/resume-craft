import React from "react";
import { Card } from "@/components/ui/card";
import LoginForm from "@/components/auth/login/LoginForm";

type LoginPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * The login page component.
 */
const LoginPage: React.FC<LoginPageProps> = () => {
  return (
    <div className="p-6">
      <Card className="border-0 shadow-none sm:border sm:shadow-sm sm:p-6 p-1 w-full sm:max-w-2xl mx-auto">
        <h1 className="text-brand-neutral-8 text-center text-4xl font-bold">
          Login
        </h1>
        <p className="text-brand-neutral-8 text-center text-lg mt-4">
          Welcome back! Please login to your account.
        </p>

        <LoginForm />
        <p className="mt-6 text-center text-wrap">
          Dont have an account? Click here to{" "}
          <a
            href="/signup"
            className="text-brand-primary-7 hover:underline font-semibold"
          >
            Signup
          </a>
        </p>
      </Card>
    </div>
  );
};
export default LoginPage;
