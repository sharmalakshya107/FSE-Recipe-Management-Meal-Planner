import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useLoginMutation } from "../../services/api/authApi";
import { useAppForm } from "../../hooks/useAppForm";
import { loginSchema, LoginInput } from "@recipe-planner/shared";
import { setCredentials } from "../../app/store/authSlice";
import { ROUTES } from "../../config/routes";
import { ENV } from "../../config/env";
import { LogIn, Mail, Lock, ArrowRight, Github } from "lucide-react";
import googleIcon from "../../assets/icons/google.svg";
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

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm({
    schema: loginSchema,
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials(response));
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-indigo-600 text-white shadow-sm">
              <LogIn size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Sign In
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm"
                />
              </div>
              {errors.email && (
                <p className="ml-1 text-xs font-medium text-rose-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm"
                />
              </div>
              {errors.password && (
                <p className="ml-1 text-xs font-medium text-rose-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors mt-2"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium text-center">
                {"data" in error && isApiError(error)
                  ? error.data.message
                  : "Authentication failed. Please try again."}
              </div>
            )}
          </form>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-bold">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={`${ENV.API_BASE_URL}/auth/google`}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <img src={googleIcon} className="w-4 h-4" alt="Google" />
                <span className="text-xs font-bold text-gray-700">Google</span>
              </a>

              <a
                href={`${ENV.API_BASE_URL}/auth/github`}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Github size={16} className="text-gray-900" />
                <span className="text-xs font-bold text-gray-700">GitHub</span>
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
