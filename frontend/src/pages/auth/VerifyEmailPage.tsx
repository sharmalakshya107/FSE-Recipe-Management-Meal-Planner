import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "../../config/routes";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/feedback/Spinner";
import { ShieldCheck, Mail, CheckCircle, XCircle } from "lucide-react";
import { useVerifyEmailMutation } from "../../services/api/authApi";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verifyEmail] = useVerifyEmailMutation();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await verifyEmail(token).unwrap();
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[rgb(var(--background))] flex items-center justify-center p-6">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />

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
            <ShieldCheck size={32} />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Verify Email
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Confirming your account email address.
          </p>
        </div>

        <div className="glass-card rounded-[40px] p-8 md:p-10 border-white/40 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <div className="relative">
                  <Spinner size="lg" className="mx-auto" />
                  <Mail
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600"
                    size={24}
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Verifying...
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
                    Processing your verification token
                  </p>
                </div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto relative">
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

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Email Verified
                  </h2>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-xs mx-auto">
                    Your identity has been confirmed. You can now access your
                    account.
                  </p>
                </div>

                <Link to={ROUTES.LOGIN} className="w-full block">
                  <Button className="btn-primary w-full h-14 rounded-2xl shadow-xl shadow-indigo-100 font-bold uppercase tracking-widest text-[10px]">
                    Continue to Login
                  </Button>
                </Link>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                  <XCircle size={40} />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Verification Failed
                  </h2>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-xs mx-auto">
                    The link is invalid or has expired. Please try registering
                    again.
                  </p>
                </div>

                <Link to={ROUTES.REGISTER} className="w-full block">
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-gray-100 hover:border-rose-100 font-bold uppercase tracking-widest text-[10px]"
                  >
                    Back to Register
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
