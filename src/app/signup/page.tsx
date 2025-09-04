"use client";

import React, { useState } from "react";
import {
  Shield,
  User,
  Mail,
  Phone,
  FileText,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",

    // Step 2: Contact Details
    email: "",
    phone: "",
    address: "",
    state: "",

    // Step 3: Identification
    idType: "nin",
    nin: "",
    bvn: "",

    // Step 4: Security
    password: "",
    confirmPassword: "",

    // Step 5: Agreement
    agreeToTerms: false,
    agreeToPrivacy: false,
    newsletter: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: "Personal Details", icon: <User className="w-5 h-5" /> },
    { id: 2, title: "Contact Info", icon: <Mail className="w-5 h-5" /> },
    { id: 3, title: "Identification", icon: <FileText className="w-5 h-5" /> },
    { id: 4, title: "Security", icon: <Lock className="w-5 h-5" /> },
    { id: 5, title: "Agreement", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const handleChange = (e) => {
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Please select gender";
    }

    if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }

      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }

      if (!formData.state) {
        newErrors.state = "Please select your state";
      }
    }

    if (step === 3) {
      if (formData.idType === "nin" && !formData.nin.trim()) {
        newErrors.nin = "NIN is required";
      } else if (formData.idType === "bvn" && !formData.bvn.trim()) {
        newErrors.bvn = "BVN is required";
      }
    }

    if (step === 4) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password =
          "Password must contain uppercase, lowercase and number";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (step === 5) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
      if (!formData.agreeToPrivacy) {
        newErrors.agreeToPrivacy = "You must agree to the privacy policy";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);

        // Scroll to top on step change
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);

      // Scroll to top on step change
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      alert("Account created successfully!");
    }, 1500);
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Story & Progress */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Shield className="w-8 h-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold">SecureID</h1>
            </div>
            <p className="text-sm text-foreground/70">
              Government-compliant identity verification
            </p>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">
              Your Journey to Secure Identity Starts Here
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Personal Details</h3>
                  <p className="text-foreground/70 text-sm">
                    Tell us a little about yourself
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Contact Information</h3>
                  <p className="text-foreground/70 text-sm">
                    How can we reach you?
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Identity Verification</h3>
                  <p className="text-foreground/70 text-sm">
                    Verify with NIN or BVN
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 mt-0.5">
                  4
                </div>
                <div>
                  <h3 className="font-medium">Security Setup</h3>
                  <p className="text-foreground/70 text-sm">
                    Create a strong password
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 mt-0.5">
                  5
                </div>
                <div>
                  <h3 className="font-medium">Agreement</h3>
                  <p className="text-foreground/70 text-sm">
                    Review and accept terms
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center mb-2">
                <Shield className="w-4 h-4 text-primary mr-2" />
                <h3 className="font-medium text-sm">Your data is protected</h3>
              </div>
              <p className="text-foreground/70 text-xs">
                We use military-grade encryption to keep your information safe
                and secure.
              </p>
            </div>
          </div>

          {/* Progress bar for mobile */}
          <div className="md:hidden mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-foreground/70">
                {progressPercentage.toFixed(0)}% Complete
              </span>
            </div>
            <div className="w-full bg-foreground/10 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-6 md:p-8">
          {/* Progress Steps */}
          <div className="hidden md:flex justify-between mb-8 relative">
            <div className="absolute top-3 left-0 right-0 h-1 bg-foreground/10 -z-10"></div>
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id
                      ? "bg-primary text-white"
                      : "bg-foreground/10 text-foreground/60"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div
                  className={`text-xs mt-2 text-center ${
                    currentStep >= step.id
                      ? "text-foreground font-medium"
                      : "text-foreground/50"
                  }`}
                >
                  {step.title}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {currentStep === 1 && "Personal Details"}
              {currentStep === 2 && "Contact Information"}
              {currentStep === 3 && "Identity Verification"}
              {currentStep === 4 && "Security Setup"}
              {currentStep === 5 && "Terms & Conditions"}
            </h2>
            <p className="text-foreground/70">
              {currentStep === 1 && "Tell us a little about yourself"}
              {currentStep === 2 && "How can we reach you?"}
              {currentStep === 3 && "Verify your identity with NIN or BVN"}
              {currentStep === 4 && "Create a secure password"}
              {currentStep === 5 && "Review and accept our terms"}
            </p>
          </div>

          <form className="space-y-4">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.firstName ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName}
                      </p>
                    )}
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
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.lastName ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
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
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.dateOfBirth ? "border-red-500" : "border-border"
                    } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.gender ? "border-red-500" : "border-border"
                    } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-border"
                    } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? "border-red-500" : "border-border"
                    } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-2"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.address ? "border-red-500" : "border-border"
                    } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium mb-2"
                  >
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.state ? "border-red-500" : "border-border"
                    } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    <option value="">Select State</option>
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="kano">Kano</option>
                    <option value="rivers">Rivers</option>
                    <option value="others">Others</option>
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Identification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Verification Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        id="id-nin"
                        name="idType"
                        type="radio"
                        value="nin"
                        checked={formData.idType === "nin"}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="id-nin"
                        className={`block p-4 border rounded-lg cursor-pointer text-center ${
                          formData.idType === "nin"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <FileText className="w-6 h-6 mx-auto mb-2 text-foreground/70" />
                        <span>Verify with NIN</span>
                      </label>
                    </div>

                    <div>
                      <input
                        id="id-bvn"
                        name="idType"
                        type="radio"
                        value="bvn"
                        checked={formData.idType === "bvn"}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="id-bvn"
                        className={`block p-4 border rounded-lg cursor-pointer text-center ${
                          formData.idType === "bvn"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <Zap className="w-6 h-6 mx-auto mb-2 text-foreground/70" />
                        <span>Verify with BVN</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.idType === "nin" && (
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
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.nin ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your 11-digit NIN"
                      maxLength="11"
                    />
                    {errors.nin && (
                      <p className="mt-1 text-sm text-red-500">{errors.nin}</p>
                    )}
                    <p className="text-xs text-foreground/60 mt-2">
                      Your NIN will be verified with the National Identity
                      Management Commission
                    </p>
                  </div>
                )}

                {formData.idType === "bvn" && (
                  <div>
                    <label
                      htmlFor="bvn"
                      className="block text-sm font-medium mb-2"
                    >
                      Bank Verification Number (BVN)
                    </label>
                    <input
                      type="text"
                      id="bvn"
                      name="bvn"
                      value={formData.bvn}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.bvn ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your 11-digit BVN"
                      maxLength="11"
                    />
                    {errors.bvn && (
                      <p className="mt-1 text-sm text-red-500">{errors.bvn}</p>
                    )}
                    <p className="text-xs text-foreground/60 mt-2">
                      Your BVN will be verified with your bank
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Security */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.password ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10`}
                      placeholder="Create a strong password"
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                  <div className="text-xs text-foreground/60 mt-2">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside">
                      <li
                        className={
                          formData.password.length >= 8 ? "text-green-500" : ""
                        }
                      >
                        At least 8 characters
                      </li>
                      <li
                        className={
                          /(?=.*[a-z])/.test(formData.password)
                            ? "text-green-500"
                            : ""
                        }
                      >
                        One lowercase letter
                      </li>
                      <li
                        className={
                          /(?=.*[A-Z])/.test(formData.password)
                            ? "text-green-500"
                            : ""
                        }
                      >
                        One uppercase letter
                      </li>
                      <li
                        className={
                          /(?=.*\d)/.test(formData.password)
                            ? "text-green-500"
                            : ""
                        }
                      >
                        One number
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-foreground/50" />
                      ) : (
                        <Eye className="w-5 h-5 text-foreground/50" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Agreement */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Terms and Conditions</h3>
                  <div className="text-sm text-foreground/70 space-y-3">
                    <p>
                      Welcome to SecureID! By creating an account, you agree to
                      the following terms and conditions:
                    </p>

                    <h4 className="font-medium mt-4">
                      1. Account Registration
                    </h4>
                    <p>
                      You must provide accurate and complete information during
                      the registration process. You are responsible for
                      maintaining the confidentiality of your account
                      credentials.
                    </p>

                    <h4 className="font-medium mt-4">
                      2. Identity Verification
                    </h4>
                    <p>
                      You authorize us to verify your identity using the
                      information you provide, including your NIN, BVN, and
                      other personal details. This verification may involve
                      sharing your information with government agencies and
                      financial institutions.
                    </p>

                    <h4 className="font-medium mt-4">3. Data Privacy</h4>
                    <p>
                      We are committed to protecting your personal information.
                      Your data will be handled in accordance with our Privacy
                      Policy and applicable data protection laws.
                    </p>

                    <h4 className="font-medium mt-4">4. Acceptable Use</h4>
                    <p>
                      You agree to use our services only for lawful purposes and
                      in accordance with these terms. You may not use our
                      services to engage in fraudulent activities or violate any
                      applicable laws.
                    </p>

                    <p className="mt-4">
                      By checking the boxes below, you acknowledge that you have
                      read, understood, and agree to be bound by these Terms and
                      Conditions and our Privacy Policy.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="mt-1 mr-2"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-foreground/80"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToPrivacy"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleChange}
                      className="mt-1 mr-2"
                    />
                    <label
                      htmlFor="agreeToPrivacy"
                      className="text-sm text-foreground/80"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToPrivacy && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.agreeToPrivacy}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="mt-1 mr-2"
                    />
                    <label
                      htmlFor="newsletter"
                      className="text-sm text-foreground/80"
                    >
                      I want to receive updates and promotional materials
                    </label>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-lg font-medium hover:bg-background transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Back
            </button>

            <button
              onClick={nextStep}
              disabled={isSubmitting}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {currentStep === steps.length ? (
                isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )
              ) : (
                <>
                  Next <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>

          {/* Progress indicator for mobile */}
          <div className="mt-6 text-center text-sm text-foreground/60 md:hidden">
            Step {currentStep} of {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
}
