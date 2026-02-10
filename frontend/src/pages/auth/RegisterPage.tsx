import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../../services/api/authApi";
import { useAppForm } from "../../hooks/useAppForm";
import { registerSchema, RegisterInput } from "@recipe-planner/shared";
import { ROUTES } from "../../config/routes";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { Button } from "../../components/ui/Button";

interface ApiError {
  data: {
    message: string;
  };
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as Record<string, { message?: string }>).data?.message ===
      "string"
  );
}

const RegisterPage = () => {
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm({
    schema: registerSchema,
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser(data).unwrap();
      setIsSuccess(true);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-indigo-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-gray-500 mb-8">
            We've sent a verification link to your email address. Please verify
            your account to continue.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button className="w-full">Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-indigo-600 text-white shadow-sm">
            <UserPlus size={28} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
            Create Account
          </h2>
          <p className="text-gray-500 font-medium">
            Join us and start planning your meals today.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User size={16} />
                  </div>
                  <input
                    {...register("firstName")}
                    type="text"
                    placeholder="John"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                {errors.firstName && (
                  <p className="ml-1 text-[10px] font-bold text-rose-500 uppercase">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
                {errors.lastName && (
                  <p className="ml-1 text-[10px] font-bold text-rose-500 uppercase">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>
              {errors.email && (
                <p className="ml-1 text-[10px] font-bold text-rose-500 uppercase">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>
              {errors.password && (
                <p className="ml-1 text-[10px] font-bold text-rose-500 uppercase">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full h-11 rounded-xl mt-4"
            >
              <span>Create Account</span>
            </Button>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold text-center uppercase tracking-wider">
                {isApiError(error)
                  ? error.data.message
                  : "Registration failed."}
              </div>
            )}
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm font-medium">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
