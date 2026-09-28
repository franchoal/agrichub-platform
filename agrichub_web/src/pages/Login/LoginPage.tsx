import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../layouts/AuthLayout";

import {
  Button,
  Card,
  Input,
} from "../../components/ui";

import {
  loginSchema,
  type LoginFormData,
} from "../../validators/authSchemas";

import { useLogin } from "../../hooks/useLogin";

const LoginPage = () => {
  const [searchParams] = useSearchParams();

  /*
   * Preserve the destination that brought the user
   * to the login page.
   *
   * Example:
   * /login?returnTo=/farmer
   */
  const returnTo = searchParams.get("returnTo");

  /*
   * Only allow internal AgricWise routes to be used
   * as redirect destinations.
   *
   * This prevents an external URL from being supplied
   * through the query string.
   */
  const redirectTo =
    returnTo && returnTo.startsWith("/")
      ? returnTo
      : undefined;

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /*
  ==========================================
  Login Mutation
  ==========================================
  */

  const {
    mutate,
    isPending,
  } = useLogin({
    redirectTo,
  });

  /*
  ==========================================
  Submit
  ==========================================
  */

  const onSubmit = (
    data: LoginFormData
  ) => {
    mutate(data);
  };

  return (
    <AuthLayout>
      <Card
        title="Welcome Back"
        subtitle="Sign in to your AgricWise account to buy, sell, connect, learn and grow."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            {...register("password")}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            disabled={isPending}
          >
            {
              isPending
                ? "Signing In..."
                : "Sign In"
            }
          </Button>

          <div className="border-t pt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
            </p>

            <Link
              to={
                returnTo
                  ? `/register?returnTo=${encodeURIComponent(returnTo)}`
                  : "/register"
              }
              className="mt-2 inline-block font-semibold text-green-700 hover:underline"
            >
              Create an AgricWise Account
            </Link>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm">
            <p className="font-semibold text-green-700">
              One Account. Many Possibilities.
            </p>

            <p className="mt-2 text-gray-600">
              Use AgricWise to discover products, sell what you offer,
              request products or services, connect with people and
              businesses, learn, and participate in the agricultural community.
            </p>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;