"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  User,
  ArrowLeft,
  CheckCircle,
  Home,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  RotateCw,
  Camera,
} from "lucide-react";
import Link from "next/link";

export default function VerifyNINPage() {
  const [formData, setFormData] = useState({
    nin: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  });
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [documentFront, setDocumentFront] = useState<string | null>(null);
  const [documentBack, setDocumentBack] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"manual" | "document">("manual");

  const fileInputFront = useRef<HTMLInputElement>(null);
  const fileInputBack = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For NIN field, only allow numbers and limit to 11 digits
    if (name === "nin") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 11) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file");
      setVerificationStatus("error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (side === "front") {
        setDocumentFront(e.target?.result as string);
      } else {
        setDocumentBack(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation based on active tab
    if (activeTab === "manual") {
      if (
        !formData.nin ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.dateOfBirth
      ) {
        setErrorMessage("Please fill in all fields");
        setVerificationStatus("error");
        return;
      }

      if (formData.nin.length !== 11) {
        setErrorMessage("NIN must be 11 digits");
        setVerificationStatus("error");
        return;
      }
    } else {
      if (!documentFront) {
        setErrorMessage("Please upload front of your ID document");
        setVerificationStatus("error");
        return;
      }
    }

    setIsLoading(true);
    setVerificationStatus("verifying");

    try {
      // Simulate API call to verify NIN
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate for demo

        if (isSuccess) {
          setVerificationStatus("success");
        } else {
          setErrorMessage(
            "Verification failed. Please check your information and try again."
          );
          setVerificationStatus("error");
        }
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      setVerificationStatus("error");
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setVerificationStatus("idle");
    setErrorMessage("");
    if (activeTab === "document") {
      setDocumentFront(null);
      setDocumentBack(null);
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
              <h3 className="font-medium text-sm">NIN Verification</h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Verify your National Identification Number for identity
              confirmation
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {verificationStatus === "success"
                ? "Verification Successful"
                : "Verify Your Identity"}
            </h2>
            <p className="text-foreground/70 mt-2">
              {verificationStatus === "success"
                ? "Your identity has been successfully verified."
                : "Confirm your identity using your National Identification Number"}
            </p>
          </div>

          {verificationStatus !== "success" ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6 border-b border-border">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`pb-2 px-1 font-medium text-sm ${
                      activeTab === "manual"
                        ? "border-b-2 border-primary text-primary"
                        : "text-foreground/70"
                    }`}
                    onClick={() => setActiveTab("manual")}
                  >
                    Enter Manually
                  </button>
                  <button
                    type="button"
                    className={`pb-2 px-1 font-medium text-sm ${
                      activeTab === "document"
                        ? "border-b-2 border-primary text-primary"
                        : "text-foreground/70"
                    }`}
                    onClick={() => setActiveTab("document")}
                  >
                    Upload Document
                  </button>
                </div>
              </div>

              {activeTab === "manual" ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="nin"
                      className="block text-sm font-medium mb-2"
                    >
                      National Identification Number (NIN)
                    </label>
                    <input
                      type="text"
                      id="nin"
                      name="nin"
                      value={formData.nin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                      placeholder="Enter your 11-digit NIN"
                      inputMode="numeric"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium mb-2"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-foreground/70 text-sm mb-4">
                      Upload photos of your government-issued ID card
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="file"
                          ref={fileInputFront}
                          onChange={(e) => handleDocumentUpload(e, "front")}
                          accept="image/*"
                          className="hidden"
                        />
                        <div
                          className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition"
                          onClick={() => fileInputFront.current?.click()}
                        >
                          {documentFront ? (
                            <div className="relative">
                              <img
                                src={documentFront}
                                alt="ID Front"
                                className="w-full h-32 object-contain rounded"
                              />
                              <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDocumentFront(null);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Camera className="w-8 h-8 text-foreground/50 mx-auto mb-2" />
                              <p className="text-sm text-foreground/70">
                                Front of ID
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <input
                          type="file"
                          ref={fileInputBack}
                          onChange={(e) => handleDocumentUpload(e, "back")}
                          accept="image/*"
                          className="hidden"
                        />
                        <div
                          className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition"
                          onClick={() => fileInputBack.current?.click()}
                        >
                          {documentBack ? (
                            <div className="relative">
                              <img
                                src={documentBack}
                                alt="ID Back"
                                className="w-full h-32 object-contain rounded"
                              />
                              <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDocumentBack(null);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Camera className="w-8 h-8 text-foreground/50 mx-auto mb-2" />
                              <p className="text-sm text-foreground/70">
                                Back of ID
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-foreground/50 mt-4">
                      Upload clear images of your government-issued ID card
                    </p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10 mt-6">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5 mr-2" /> Verify Identity
                  </>
                )}
              </button>
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
                  Identity Verification Successful
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Your National Identification Number has been successfully
                  verified and added to your account.
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

          {verificationStatus === "error" && (
            <div className="text-center mt-4">
              <button
                onClick={handleRetry}
                className="text-primary hover:underline text-sm font-medium flex items-center justify-center mx-auto"
              >
                <RotateCw className="w-4 h-4 mr-1" /> Try Again
              </button>
            </div>
          )}

          {/* Back to previous link */}
          <div className="flex justify-center mt-6">
            <Link
              href="/identity"
              className="text-primary hover:underline text-sm flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Verification
              Options
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
