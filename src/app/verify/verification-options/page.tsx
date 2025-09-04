"use client";

import React, { useState } from "react";
import {
  Shield,
  User,
  Camera,
  CreditCard,
  FileText,
  Home,
  ArrowRight,
  CheckCircle,
  Lock,
  Zap,
  Info,
  Fingerprint,
  IdCard,
} from "lucide-react";
import Link from "next/link";

export default function VerificationOptions() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const verificationMethods = [
    {
      id: "nin-face",
      title: "NIN Facial Recognition",
      description: "Fastest NIN verification using facial recognition",
      icon: Camera,
      time: "Less than 30 seconds",
      security: "High",
      recommended: true,
      route: "/verify/nin-face",
    },
    {
      id: "nin-manual",
      title: "NIN Manual Entry",
      description: "Enter your National Identification Number manually",
      icon: IdCard,
      time: "1-2 minutes",
      security: "High",
      recommended: false,
      route: "/verify/nin",
    },
    {
      id: "bvn-face",
      title: "BVN Facial Recognition",
      description: "Fastest BVN verification using facial recognition",
      icon: Fingerprint,
      time: "Less than 30 seconds",
      security: "High",
      recommended: true,
      route: "/verify/bvn-face",
    },
    {
      id: "bvn-manual",
      title: "BVN Manual Entry",
      description: "Enter your Bank Verification Number manually",
      icon: CreditCard,
      time: "2-3 minutes",
      security: "High",
      recommended: false,
      route: "/verify/bvn",
    },
    {
      id: "document",
      title: "Document Upload",
      description: "Upload a government-issued ID document",
      icon: FileText,
      time: "3-5 minutes",
      security: "High",
      recommended: false,
      route: "/verify/doc-verify",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center mb-2">
                <Shield className="w-8 h-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold">SecureID</h1>
              </div>
              <p className="text-sm text-foreground/70">
                Choose your preferred verification method
              </p>
            </div>

            <Link
              href="/"
              className="text-primary hover:underline flex items-center text-sm"
            >
              <Home className="w-4 h-4 mr-1" /> Home
            </Link>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Identity Verification Required</h3>
                <p className="text-foreground/70 text-sm">
                  Verify your identity to access all banking features
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Verify Your Identity
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              To comply with financial regulations and ensure the security of
              your account, we need to verify your identity. Choose the method
              that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {verificationMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    selectedOption === method.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:shadow-sm"
                  } ${
                    method.recommended
                      ? "ring-2 ring-primary ring-opacity-50"
                      : ""
                  }`}
                  onClick={() => setSelectedOption(method.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-lg ${
                        method.id.includes("face")
                          ? "bg-blue-100 text-blue-600"
                          : method.id.includes("nin")
                          ? "bg-green-100 text-green-600"
                          : method.id.includes("bvn")
                          ? "bg-purple-100 text-purple-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {method.recommended && (
                      <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-foreground mb-2">
                    {method.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    {method.description}
                  </p>

                  <div className="flex justify-between text-xs text-foreground/60">
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {method.time}
                    </span>
                    <span className="flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      {method.security} security
                    </span>
                  </div>

                  <div
                    className={`mt-4 h-1 w-full rounded-full ${
                      selectedOption === method.id ? "bg-primary" : "bg-border"
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* Information Section */}
          <div className="bg-primary/5 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-primary" />
              Why verification is important
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground/70">
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Prevents fraud and identity theft</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Complies with financial regulations</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Secures your account and transactions</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Enables full access to banking features</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={
                selectedOption
                  ? verificationMethods.find((m) => m.id === selectedOption)
                      ?.route || "/"
                  : "#"
              }
              className={`flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center ${
                !selectedOption ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={(e) => !selectedOption && e.preventDefault()}
            >
              Continue with Selected Method
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <Link
              href="/"
              className="px-6 py-3 rounded-lg font-medium text-foreground hover:bg-primary/5 transition flex items-center justify-center"
            >
              Cancel Verification
            </Link>
          </div>

          {/* Security Assurance */}
          <div className="text-center mt-8 pt-6 border-t border-border">
            <p className="text-xs text-foreground/60 flex items-center justify-center">
              <Lock className="w-3 h-3 mr-1" />
              Your data is encrypted and secure. We never share your information
              with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
