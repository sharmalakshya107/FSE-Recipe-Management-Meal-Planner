import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "../../config/routes";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/feedback/Alert";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  ShieldQuestion,
  Sparkles,
} from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[rgb(var(--background))] flex items-center justify-center p-6">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex p-4 rounded-3xl bg-white shadow-xl shadow-indigo-100 text-indigo-600 mb-6 border border-gray-50"
          >
            <ShieldQuestion size={32} />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Forgot Password
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <div className="glass-card rounded-[40px] p-8 md:p-10 border-white/40 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {error && (
                  <Alert
                    variant="error"
                    className="rounded-2xl border-none bg-rose-50 text-rose-600 font-bold"
                  >
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                        size={20}
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="input-field pl-12 h-14"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="btn-primary w-full h-14 rounded-2xl flex items-center justify-center gap-2"
                    isLoading={isLoading}
                  >
                    <span>Send Reset Link</span>
                  </Button>
                </form>

                <div className="pt-6 border-t border-gray-100/50 flex justify-center">
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors group"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    <CheckCircle size={48} className="text-emerald-500" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 border-2 border-dashed border-emerald-200 rounded-full"
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
                  Email Sent
                </h2>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                  <p className="text-sm font-medium text-gray-500">
                    We've sent a recovery link to:
                    <br />
                    <span className="font-bold text-gray-900">{email}</span>
                  </p>
                </div>

                <Link to={ROUTES.LOGIN}>
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-gray-100 hover:border-indigo-100 font-bold flex items-center justify-center gap-2 group"
                  >
                    <ArrowLeft
                      size={18}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    Return to Login
                  </Button>
                </Link>

                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 py-2 px-4 rounded-full mx-auto w-fit">
                  <Sparkles size={12} />
                  Check your spam folder
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
