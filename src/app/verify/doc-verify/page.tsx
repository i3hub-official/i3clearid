"use client";

import React, { useState, useRef } from "react";
import {
  Shield,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  RotateCw,
  Home,
  ArrowLeft,
  Camera,
  X,
} from "lucide-react";
import Link from "next/link";

export default function DocumentVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [documentFront, setDocumentFront] = useState<string | null>(null);
  const [documentBack, setDocumentBack] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");

  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    "International Passport",
    "Driver's License",
    // "National ID Card",
    "Voter's Card",
    "Other Government ID",
  ];

  const handleDocumentUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file (JPEG, PNG, etc.)");
      setVerificationStatus("error");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size too large. Please upload files under 5MB.");
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

    if (!documentType) {
      setErrorMessage("Please select a document type");
      setVerificationStatus("error");
      return;
    }

    if (!documentFront) {
      setErrorMessage("Please upload the front of your document");
      setVerificationStatus("error");
      return;
    }

    if (documentType !== "International Passport" && !documentBack) {
      setErrorMessage("Please upload the back of your document");
      setVerificationStatus("error");
      return;
    }

    if (!documentNumber.trim()) {
      setErrorMessage("Please enter your document number");
      setVerificationStatus("error");
      return;
    }

    setIsLoading(true);
    setVerificationStatus("processing");

    try {
      // Simulate API call to verify document
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate for demo

        if (isSuccess) {
          setVerificationStatus("success");
        } else {
          setErrorMessage(
            "Document verification failed. Please ensure your documents are clear and valid."
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
    setDocumentFront(null);
    setDocumentBack(null);
    setDocumentType("");
    setDocumentNumber("");
  };

  const removeImage = (side: "front" | "back") => {
    if (side === "front") {
      setDocumentFront(null);
    } else {
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
                Secure document verification
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
              <FileText className="w-4 h-4 text-primary mr-2" />
              <h3 className="font-medium text-sm">Document Verification</h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Verify your identity using government-issued documents
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {verificationStatus === "success"
                ? "Verification Successful"
                : "Verify with Document"}
            </h2>
            <p className="text-foreground/70 mt-2">
              {verificationStatus === "success"
                ? "Your document has been successfully verified."
                : "Upload photos of your government-issued ID document"}
            </p>
          </div>

          {verificationStatus !== "success" ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Document Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                  >
                    <option value="">Select document type</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Document Number
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                    placeholder="Enter your document number"
                  />
                </div>

                {/* Document Upload Section */}
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-foreground/70 text-sm mb-4">
                      Upload clear photos of your document
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Front of Document */}
                      <div>
                        <input
                          type="file"
                          ref={fileInputFrontRef}
                          onChange={(e) => handleDocumentUpload(e, "front")}
                          accept="image/*"
                          className="hidden"
                        />
                        <div
                          className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition h-40 flex items-center justify-center"
                          onClick={() => fileInputFrontRef.current?.click()}
                        >
                          {documentFront ? (
                            <div className="relative w-full h-full">
                              <img
                                src={documentFront}
                                alt="Document Front"
                                className="w-full h-full object-contain rounded"
                              />
                              <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage("front");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Camera className="w-8 h-8 text-foreground/50 mx-auto mb-2" />
                              <p className="text-sm text-foreground/70">
                                Front Side
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Back of Document - Not required for passport */}
                      {documentType !== "International Passport" && (
                        <div>
                          <input
                            type="file"
                            ref={fileInputBackRef}
                            onChange={(e) => handleDocumentUpload(e, "back")}
                            accept="image/*"
                            className="hidden"
                          />
                          <div
                            className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition h-40 flex items-center justify-center"
                            onClick={() => fileInputBackRef.current?.click()}
                          >
                            {documentBack ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={documentBack}
                                  alt="Document Back"
                                  className="w-full h-full object-contain rounded"
                                />
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage("back");
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Camera className="w-8 h-8 text-foreground/50 mx-auto mb-2" />
                                <p className="text-sm text-foreground/70">
                                  Back Side
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-foreground/50 mt-4">
                      {documentType === "International Passport"
                        ? "Upload the photo page of your passport"
                        : "Upload both front and back of your document"}
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <p className="text-red-500 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

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
                      <FileText className="w-5 h-5 mr-2" /> Verify Document
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
                  Document Verification Successful
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Your {documentType} has been successfully verified and added
                  to your account.
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

          {/* Back to verification options link */}
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
