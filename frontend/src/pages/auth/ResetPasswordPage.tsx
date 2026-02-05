import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "../../config/routes";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/feedback/Alert";
import {
  Lock,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Key,
  RefreshCw,
} from "lucide-react";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 3000);
    } catch (err) {
      setError("Failed to reset password. Link may be expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-xl bg-indigo-600 text-white shadow-sm mb-4">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Reset Password
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Create a new secure password for your account.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          {!token ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <RefreshCw size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Invalid Link
              </h2>
              <p className="text-sm font-medium text-gray-500 mb-6 font-medium">
                This reset link is either invalid or has expired.
              </p>
              <Link to={ROUTES.FORGOT_PASSWORD}>
                <Button className="w-full h-11 rounded-xl">
                  Request New Link
                </Button>
              </Link>
            </div>
          ) : submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Password Updated
              </h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                Your password has been reset. Redirecting to login...
              </p>

              <Link to={ROUTES.LOGIN}>
                <Button className="w-full h-11 rounded-xl">Go to Login</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <Alert variant="error" className="rounded-xl">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl mt-2"
                  isLoading={isLoading}
                >
                  Reset Password
                </Button>
              </form>

              <div className="pt-6 border-t border-gray-50 flex justify-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
