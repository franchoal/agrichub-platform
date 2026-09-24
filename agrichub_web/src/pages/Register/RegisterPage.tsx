import { Link, useNavigate } from "react-router-dom";
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

  const registerMutation = useRegister(() => {
    navigate("/login");
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

  const onSubmit = (
    data: RegisterFormData
  ) => {
    registerMutation.mutate(data);
  };

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

          <Input
            type="password"
            label="Password"
            placeholder="Create a password"
            {...register("password")}
            error={errors.password?.message}
          />

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
              to="/login"
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