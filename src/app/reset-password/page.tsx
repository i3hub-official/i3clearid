"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Shield,
  Mail,
  ArrowLeft,
  CheckCircle,
  Home,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Create a component that uses useSearchParams
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  // Password reset form state
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Verify the reset token
    const verifyToken = async () => {
      const urlToken = searchParams.get("token");
      const urlEmail = searchParams.get("email");

      if (urlToken && urlEmail) {
        setToken(urlToken);
        setEmail(urlEmail);

        // Simulate API call to verify the token
        setTimeout(() => {
          const isValid = Math.random() > 0.2; // 80% success rate for demo

          if (isValid) {
            setVerificationStatus("success");
          } else {
            setVerificationStatus("error");
          }
        }, 2000);
      } else {
        setVerificationStatus("error");
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.password || !formData.confirmPassword) {
      setErrorMessage("Please fill in all fields");
      setResetStatus("error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setResetStatus("error");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      setResetStatus("error");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to reset password
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate for demo

        if (isSuccess) {
          setResetStatus("success");
        } else {
          setErrorMessage("Failed to reset password. Please try again.");
          setResetStatus("error");
        }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      setResetStatus("error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md lg:max-w-lg bg-card rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 lg:p-8">
          <div className="flex justify-between items-start mb-6 lg:mb-8">
            <div>
              <div className="flex items-center mb-2">
                <Shield className="w-7 h-7 lg:w-8 lg:h-8 text-primary mr-2" />
                <h1 className="text-xl lg:text-2xl font-bold">SecureID</h1>
              </div>
              <p className="text-xs lg:text-sm text-foreground/70">
                Bank-verified identity authentication
              </p>
            </div>

            <Link
              href="/"
              className="text-primary hover:underline flex items-center text-xs lg:text-sm"
            >
              <Home className="w-4 h-4 mr-1" /> Home
            </Link>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center mb-2">
              <Shield className="w-4 h-4 text-primary mr-2" />
              <h3 className="font-medium text-sm">
                {verificationStatus === "verifying"
                  ? "Password Reset Verification"
                  : verificationStatus === "success"
                  ? "Password Reset"
                  : "Verification Failed"}
              </h3>
            </div>
            <p className="text-foreground/70 text-xs">
              {verificationStatus === "verifying"
                ? "Verifying your password reset request for security purposes."
                : verificationStatus === "success"
                ? "Create a new password for your account."
                : "This password reset link is invalid or has expired."}
            </p>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">
              {verificationStatus === "verifying"
                ? "Verifying Your Request"
                : verificationStatus === "success" && resetStatus === "idle"
                ? "Create New Password"
                : verificationStatus === "success" && resetStatus === "success"
                ? "Password Reset Successful"
                : "Verification Failed"}
            </h2>
            <p className="text-foreground/70 mt-2 text-sm lg:text-base">
              {verificationStatus === "verifying"
                ? "Please wait while we verify your password reset link."
                : verificationStatus === "success" && resetStatus === "idle"
                ? "Please enter your new password below."
                : verificationStatus === "success" && resetStatus === "success"
                ? "Your password has been successfully reset. You can now sign in with your new password."
                : "This password reset link is invalid or has expired."}
            </p>
          </div>

          {verificationStatus === "verifying" && (
            <div className="text-center py-6 lg:py-8">
              <div className="w-14 h-14 lg:w-16 lg:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-foreground/70 text-sm lg:text-base">
                Verifying your reset request...
              </p>
            </div>
          )}

          {verificationStatus === "success" && resetStatus === "idle" && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition text-sm lg:text-base"
                      placeholder="Enter your new password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition text-sm lg:text-base"
                      placeholder="Confirm your new password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" /> Reset Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {verificationStatus === "success" && resetStatus === "success" && (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/10 mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="font-medium mb-2 text-foreground text-sm lg:text-base">
                  Password Reset Successful
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Your password has been successfully reset. You can now sign in
                  with your new password.
                </p>
              </div>

              <Link
                href="/signin"
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center text-sm lg:text-base"
              >
                Sign In
              </Link>
            </div>
          )}

          {verificationStatus === "success" && resetStatus === "error" && (
            <div className="text-center py-4">
              <div className="bg-red-500/5 rounded-lg p-6 border border-red-500/10 mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-500/10 p-3 rounded-full">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <h3 className="font-medium mb-2 text-foreground text-sm lg:text-base">
                  Password Reset Failed
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  {errorMessage ||
                    "Failed to reset password. Please try again."}
                </p>
              </div>

              <button
                onClick={() => setResetStatus("idle")}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center mb-4 text-sm lg:text-base"
              >
                Try Again
              </button>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="text-center py-4">
              <div className="bg-red-500/5 rounded-lg p-6 border border-red-500/10 mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-500/10 p-3 rounded-full">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <h3 className="font-medium mb-2 text-foreground text-sm lg:text-base">
                  Verification Failed
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  This password reset link is invalid or has expired. Please
                  request a new password reset link.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/forgot-password"
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center text-sm lg:text-base"
                >
                  <Mail className="w-5 h-5 mr-2" /> Request New Reset Link
                </Link>

                <Link
                  href="/signin"
                  className="w-full border border-border px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition flex items-center justify-center text-sm lg:text-base"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Desktop back to home link */}
          <div className="flex justify-center mt-6">
            <Link
              href="/"
              className="text-primary hover:underline text-sm flex items-center"
            >
              <Home className="w-4 h-4 mr-1" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the content with Suspense
export default function VerifyResetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 py-8">
          <div className="w-full max-w-md bg-card rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-foreground/70">Loading verification...</p>
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
