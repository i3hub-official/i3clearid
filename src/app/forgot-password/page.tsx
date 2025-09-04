"use client";

import React, { useState } from "react";
import { Shield, Mail, ArrowLeft, CheckCircle, Home } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        console.log("Password reset requested for:", email);
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center mb-2">
                <Shield className="w-8 h-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold">SecureID</h1>
              </div>
              <p className="text-sm text-foreground/70">
                Government-compliant identity verification
              </p>
            </div>

            {/* Mobile-only back to home button */}
            <Link
              href="/"
              className="md:hidden text-primary hover:underline flex items-center text-sm"
            >
              <Home className="w-4 h-4 mr-1" /> Home
            </Link>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center mb-2">
              <Shield className="w-4 h-4 text-primary mr-2" />
              <h3 className="font-medium text-sm">Password Recovery</h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Recover access to your secure identity verification account.
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {isSubmitted ? "Check Your Email" : "Reset Your Password"}
            </h2>
            <p className="text-foreground/70 mt-2">
              {isSubmitted
                ? "We've sent a password reset link to your email"
                : "Enter your email address to receive a password reset link"}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-foreground/50" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-border"
                    } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Reset Link Sent</h3>
                <p className="text-foreground/70 text-sm mb-4">
                  We&apos;ve sent a password reset link to{" "}
                  <strong>{email}</strong>. Please check your inbox and follow
                  the instructions.
                </p>
                <div className="text-xs text-foreground/60 mt-4">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    try again
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/signin"
              className="text-primary hover:underline font-medium text-sm flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
            </Link>
          </div>

          {/* Desktop back to home link */}
          <div className="hidden md:flex justify-center mt-6">
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
