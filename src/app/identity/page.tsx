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
  BadgeCheck,
  Users,
  Edit2,
  Edit2Icon,
  Edit3,
} from "lucide-react";
import Link from "next/link";

export default function VerificationOptions() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const verificationMethods = [
    {
      id: "dual-verify",
      title: "One-Time Verification (Recommended)",
      description: "Complete verification with BVN + NIN + Facial Recognition",
      icon: BadgeCheck,
      time: "Less than 60 seconds",
      security: "Highest",
      recommended: true,
      route: "/verify/dual",
      badgeColor: "bg-primary/20 text-primary",
      iconColor: "text-primary",
    },
    {
      id: "nin-face",
      title: "NIN Facial Recognition",
      description: "Fast NIN verification using facial recognition",
      icon: IdCard,
      time: "Less than 30 seconds",
      security: "High",
      recommended: false,
      route: "/verify/nin-face",
      badgeColor: "bg-primary/20 text-primary",
      iconColor: "text-primary",
    },
    {
      id: "nin-manual",
      title: "NIN Manual Entry",
      description: "Enter your National Identification Number manually",
      icon: Edit3,
      time: "15-30 minutes",
      security: "Medium",
      recommended: false,
      route: "/verify/nin",
      badgeColor: "bg-primary/20 text-primary",
      iconColor: "text-primary",
    },
    {
      id: "bvn-face",
      title: "BVN Facial Recognition",
      description: "Fast BVN verification using facial recognition",
      icon: Fingerprint,
      time: "Less than 30 seconds",
      security: "High",
      recommended: false,
      route: "/verify/bvn-face",
      badgeColor: "bg-primary/20 text-primary",
      iconColor: "text-primary",
    },
    {
      id: "bvn-manual",
      title: "BVN Manual Entry",
      description: "Enter your Bank Verification Number manually",
      icon: Edit3,
      time: "15-30 minutes",
      security: "Medium",
      recommended: false,
      route: "/verify/bvn",
      badgeColor: "bg-primary/20 text-primary",
      iconColor: "text-primary",
    },
    {
      id: "document",
      title: "Document Upload",
      description: "Upload a government-issued ID document",
      icon: FileText,
      time: "15-30 minutes",
      security: "Medium",
      recommended: false,
      route: "/verify/doc-verify",
      badgeColor: "bg-primary/20 text-primary",
      iconColor: "text-primary",
    },
  ];

  const getSecurityBadgeColor = (securityLevel: string) => {
    switch (securityLevel.toLowerCase()) {
      case "highest":
        return "bg-primary/20 text-primary";
      case "high":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-5xl bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-primary/10 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center mb-2">
                <Shield className="w-8 h-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold">SecureID</h1>
              </div>
              <p className="text-muted-foreground">
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
                <p className="text-muted-foreground text-sm">
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
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
                  className={`border-gray-100 border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
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
                    <div className={`p-3 rounded-lg ${method.badgeColor}`}>
                      <Icon className={`w-6 h-6 ${method.iconColor}`} />
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
                  <p className="text-muted-foreground text-sm mb-4">
                    {method.description}
                  </p>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 mr-1 text-amber-500" />
                      {method.time}
                    </span>
                    <span
                      className={`flex items-center px-2 py-1 rounded-full text-xs ${getSecurityBadgeColor(
                        method.security
                      )}`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {method.security}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
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

          {/* One-Time Verification Highlight */}
          <div className="bg-primary/5 rounded-xl p-6 mb-8 border border-primary/10">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  One-Time Complete Verification
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Verify with BVN + NIN + Facial Recognition once and never
                  worry about verification again. This comprehensive approach
                  ensures the highest level of security and compliance.
                </p>
                <div className="flex items-center text-xs text-primary">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>
                    Highest security level • Permanent verification • Full
                    access
                  </span>
                </div>
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
              className="px-6 py-3 rounded-lg font-medium text-foreground hover:bg-primary/10 transition flex items-center justify-center border border-border"
            >
              Cancel Verification
            </Link>
          </div>

          {/* Security Assurance */}
          <div className="text-center mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-center justify-center">
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
