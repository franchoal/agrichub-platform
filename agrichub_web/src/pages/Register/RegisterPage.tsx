import { useState } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useNavigate,
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

import { useRegister } from "../../hooks/useRegister";

import {
  registerSchema,
  type RegisterFormData,
} from "../../validators/authSchemas";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  /*
   * Preserve the internal destination that brought the user
   * to registration.
   *
   * Example:
   * /register?returnTo=/farmer
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
   * After registration, the account still needs to sign in.
   *
   * Preserve the original destination through the login step so
   * that the complete flow remains:
   *
   * Register → Login → Original destination
   *
   * For business onboarding:
   *
   * /register?returnTo=/farmer
   *       ↓
   * /login?returnTo=/farmer
   *       ↓
   * /farmer
   *       ↓
   * Business Foundation / Review / Dashboard
   */
  const registerMutation = useRegister(() => {
    navigate(
      redirectTo
        ? `/login?returnTo=${encodeURIComponent(redirectTo)}`
        : "/login"
    );
  });

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      location: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  const loginPath = redirectTo
    ? `/login?returnTo=${encodeURIComponent(redirectTo)}`
    : "/login";

  return (
    <AuthLayout>
      <Card
        title="Create Your AgricWise Account"
        subtitle="Join AgricWise and connect with people, products, services, opportunities and the wider agricultural community."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <Input
            label="First Name"
            placeholder="Enter your first name"
            {...register("first_name")}
            error={errors.first_name?.message}
          />

          <Input
            label="Last Name"
            placeholder="Enter your last name"
            {...register("last_name")}
            error={errors.last_name?.message}
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            {...register("phone_number")}
            error={errors.phone_number?.message}
          />

          <Input
            label="Location"
            placeholder="City, State"
            {...register("location")}
            error={errors.location?.message}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Create a password"
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
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>

          <div className="border-t pt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?
            </p>

            <Link
              to={loginPath}
              className="mt-2 inline-block font-semibold text-green-700 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;