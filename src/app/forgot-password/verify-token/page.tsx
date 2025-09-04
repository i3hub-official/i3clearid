"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Mail,
  ArrowLeft,
  CheckCircle,
  Home,
  Lock,
  Key,
  User,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyResetPage() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Simulate verifying the reset token
    const verifyToken = async () => {
      // Get token from URL (in a real app, this would be from the URL params)
      const urlToken = searchParams.get("token");
      const urlEmail = searchParams.get("email");

      if (urlToken && urlEmail) {
        setToken(urlToken);
        setEmail(urlEmail);

        // Simulate API call to verify the token
        setTimeout(() => {
          // For demo purposes, we'll randomly decide if the token is valid
          // In a real app, this would be an actual API call to your backend
          const isValid = Math.random() > 0.2; // 80% success rate for demo

          if (isValid) {
            setVerificationStatus("success");
          } else {
            setVerificationStatus("error");
          }
        }, 2000);
      } else {
        // If no token or email provided, show error
        setVerificationStatus("error");
      }
    };

    verifyToken();
  }, [searchParams]);

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
              <h3 className="font-medium text-sm">
                Password Reset Verification
              </h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Verifying your password reset request for security purposes.
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {verificationStatus === "verifying"
                ? "Verifying Your Request"
                : verificationStatus === "success"
                ? "Verification Successful"
                : "Verification Failed"}
            </h2>
            <p className="text-foreground/70 mt-2">
              {verificationStatus === "verifying"
                ? "Please wait while we verify your password reset link."
                : verificationStatus === "success"
                ? "Your password reset link has been verified. You can now reset your password."
                : "This password reset link is invalid or has expired."}
            </p>
          </div>

          {verificationStatus === "verifying" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-foreground/70">
                Verifying your reset request...
              </p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/10 mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="font-medium mb-2 text-foreground">
                  Verification Successful
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Your password reset request has been verified. You can now
                  create a new password for your account.
                </p>
              </div>

              <Link
                href={`/reset-password?token=${token}&email=${encodeURIComponent(
                  email
                )}`}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center"
              >
                <Lock className="w-5 h-5 mr-2" /> Reset Password
              </Link>
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
                <h3 className="font-medium mb-2 text-foreground">
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
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" /> Request New Reset Link
                </Link>

                <Link
                  href="/signin"
                  className="w-full border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back to Sign In
                </Link>
              </div>
            </div>
          )}

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
