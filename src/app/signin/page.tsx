"use client";

import React, { useState } from "react";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Home,
  Phone,
  Key,
} from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [authMethod, setAuthMethod] = useState<"password" | "passkey">(
    "password"
      );
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  type Errors = {
    [key: string]: string;
  };
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or phone number is required";
    } else {
      // Check if it's an email or phone
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
      const isPhone = /^\+?[\d\s-()]{10,}$/.test(
        formData.identifier.replace(/\s/g, "")
      );

      if (!isEmail && !isPhone) {
        newErrors.identifier =
          "Please enter a valid email address or phone number";
      }
    }

    if (authMethod === "password" && !formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Determine if identifier is email or phone
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);

      // Simulate API call
      setTimeout(() => {
        console.log("Form submitted:", {
          identifier: formData.identifier,
          identifierType: isEmail ? "email" : "phone",
          authMethod,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });
        setIsSubmitting(false);
        alert("Signed in successfully!");
        formData.identifier = "";
        formData.password = "";
        formData.rememberMe = false;
      }, 1500);
    }
  };

  const handlePasskeySignIn = () => {

    setIsSubmitting(true);

    // Simulate passkey authentication
    setTimeout(() => {
      console.log("Passkey authentication successful");
      setIsSubmitting(false);
      alert("Signed in with passkey successfully!");
    }, 1500);
  };

  // Determine if identifier is email or phone to show appropriate icon
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
  const identifierIcon = isEmail ? (
    <Mail className="h-5 w-5 text-foreground/50" />
  ) : (
    <Phone className="h-5 w-5 text-foreground/50" />
  );

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
              <h3 className="font-medium text-sm">Secure Authentication</h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Sign in to access your secure identity verification dashboard.
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-foreground/70">
              Sign in to your SecureID account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium mb-2"
              >
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {identifierIcon}
                </div>
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                    errors.identifier ? "border-red-500" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  placeholder="Enter your email or phone number"
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-500">{errors.identifier}</p>
              )}
            </div>

            {/* Authentication Method Toggle */}
            <div className="flex bg-muted rounded-lg p-1 mb-6">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  authMethod === "password"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-foreground/70 hover:text-foreground"
                }`}
                onClick={() => setAuthMethod("password")}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  authMethod === "passkey"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-foreground/70 hover:text-foreground"
                }`}
                onClick={() => setAuthMethod("passkey")}
              >
                <Key className="w-4 h-4 inline mr-2" />
                Passkey
              </button>
            </div>

            {authMethod === "password" ? (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-foreground/50" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                      errors.password ? "border-red-500" : "border-border"
                    } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-foreground/50" />
                    ) : (
                      <Eye className="w-5 h-5 text-foreground/50" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}

                <div className="flex justify-between items-center mt-5">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-foreground/80"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="bg-muted rounded-lg p-6">
                  <Key className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Sign in with Passkey</h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    Use your fingerprint, face recognition, or device PIN for
                    secure authentication
                  </p>
                  <button
                    type="button"
                    onClick={handlePasskeySignIn}
                    disabled={isSubmitting}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Authenticating..." : "Use Passkey"}
                  </button>
                </div>
              </div>
            )}

            {authMethod === "password" && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-foreground/70 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:underline font-medium"
              >
                Create account
              </Link>
            </p>
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
