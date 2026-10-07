import { useState } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
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

  const [showPassword, setShowPassword] = useState(false);

  /*
   * Preserve the internal destination that brought the user
   * to the login page.
   *
   * Example:
   * /login?returnTo=/farmer
   *
   * Only internal single-slash routes are allowed.
   * This prevents protocol-relative redirects such as:
   * //example.com
   */
  const requestedReturnTo = searchParams.get("returnTo");

  const hasValidReturnTo =
    Boolean(
      requestedReturnTo &&
        requestedReturnTo.startsWith("/") &&
        !requestedReturnTo.startsWith("//")
    );

  const redirectTo = hasValidReturnTo
    ? requestedReturnTo!
    : undefined;

  /*
   * Login handles the final redirect after authentication.
   *
   * For business onboarding:
   *
   * /login?returnTo=/farmer
   *       ↓
   * successful login
   *       ↓
   * /farmer
   *       ↓
   * lifecycle gateway
   *       ↓
   * Business Foundation / Review / Dashboard
   */
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    mutate,
    isPending,
  } = useLogin({
    redirectTo,
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  const registerPath = redirectTo
    ? `/register?returnTo=${encodeURIComponent(redirectTo)}`
    : "/register";

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

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              {...register("password")}
              error={errors.password?.message}
              className="pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              aria-pressed={showPassword}
              className="absolute right-3 top-[38px] flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/30"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending
              ? "Signing In..."
              : "Sign In"}
          </Button>

          <div className="border-t pt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
            </p>

            <Link
              to={registerPath}
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