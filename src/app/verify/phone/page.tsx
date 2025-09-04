"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Phone,
  ArrowLeft,
  CheckCircle,
  Home,
  Lock,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import Link from "next/link";

export default function PhoneVerificationPage() {
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) ***-1234");
  const [otp, setOtp] = useState<string[]>(Array(8).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Start cooldown timer on component mount
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Focus on the active input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeOtpIndex]);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];

    // Update the OTP value at the specific index
    if (value === "") {
      newOtp[index] = "";
      setOtp(newOtp);

      // Move to previous input if backspace was pressed and current input is empty
      if (index > 0) {
        setActiveOtpIndex(index - 1);
      }
    } else {
      // Handle single digit input
      newOtp[index] = value.charAt(value.length - 1);
      setOtp(newOtp);

      // Move to next input if not the last one
      if (index < 7) {
        setActiveOtpIndex(index + 1);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Handle backspace key
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveOtpIndex(index - 1);
    }

    // Handle left arrow key
    if (e.key === "ArrowLeft" && index > 0) {
      setActiveOtpIndex(index - 1);
    }

    // Handle right arrow key
    if (e.key === "ArrowRight" && index < 7) {
      setActiveOtpIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Only allow numbers and limit to 8 digits
    if (/^[0-9]+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 8).split("");
      const newOtp = [...otp];

      digits.forEach((digit, index) => {
        if (index < 8) {
          newOtp[index] = digit;
        }
      });

      setOtp(newOtp);
      setActiveOtpIndex(Math.min(digits.length, 7));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all OTP fields are filled
    if (otp.some((digit) => digit === "")) {
      setErrorMessage("Please enter the complete verification code");
      setVerificationStatus("error");
      return;
    }

    setIsLoading(true);
    setVerificationStatus("verifying");

    try {
      // Simulate API call to verify OTP
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate for demo

        if (isSuccess) {
          setVerificationStatus("success");
        } else {
          setErrorMessage("Invalid verification code. Please try again.");
          setVerificationStatus("error");
        }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      setVerificationStatus("error");
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    // Reset cooldown timer (2 minutes)
    setCooldown(120);
    setCanResend(false);

    // Simulate API call to resend OTP
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Clear any previous error
      setVerificationStatus("idle");
      setErrorMessage("");

      // Clear OTP fields
      setOtp(Array(8).fill(""));
      setActiveOtpIndex(0);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
              <h3 className="font-medium text-sm">Phone Verification</h3>
            </div>
            <p className="text-foreground/70 text-xs">
              We&apos;ve sent a verification code to your phone number ending
              with {phoneNumber.split("-")[1]}
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {verificationStatus === "success"
                ? "Verification Successful"
                : "Verify Your Phone Number"}
            </h2>
            <p className="text-foreground/70 mt-2">
              {verificationStatus === "success"
                ? "Your phone number has been successfully verified."
                : `Enter the 8-digit code sent to ${phoneNumber}`}
            </p>
          </div>

          {verificationStatus !== "success" ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium mb-2"
                  >
                    Verification Code
                  </label>
                  <div className="flex justify-between space-x-2">
                    {otp.map((digit, index) => (
                      <div key={index} className="relative">
                        <input
                          ref={index === activeOtpIndex ? inputRef : null}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={handlePaste}
                          onClick={() => setActiveOtpIndex(index)}
                          className="w-10 h-12 text-center text-lg font-semibold border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                          maxLength={1}
                        />
                        {index === activeOtpIndex && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-pulse"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {errorMessage && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errorMessage}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-foreground/70">
                    {cooldown > 0 ? (
                      <span>Resend code in {formatTime(cooldown)}</span>
                    ) : (
                      <span>Didn&apos;t receive the code?</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || isLoading}
                    className="text-primary hover:underline disabled:text-foreground/30 disabled:cursor-not-allowed text-sm font-medium flex items-center"
                  >
                    <RotateCw className="w-4 h-4 mr-1" /> Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" /> Verify Phone Number
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/10 mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="font-medium mb-2 text-foreground">
                  Phone Verification Successful
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Your phone number has been successfully verified and added to
                  your account.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center"
              >
                Continue to Dashboard
              </Link>
            </div>
          )}

          {/* Back to sign in link */}
          <div className="flex justify-center mt-6">
            <Link
              href="/signin"
              className="text-primary hover:underline text-sm flex items-center"
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
