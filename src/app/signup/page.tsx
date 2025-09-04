"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Home,
  MapPin,
} from "lucide-react";

type FormDataType = {
  surname: string;
  firstname: string;
  othername: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  lga: string;
  idType: "nin" | "bvn";
  nin: string;
  bvn: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  newsletter: boolean;
};

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormDataType>({
    // Step 1: Personal Details
    surname: "",
    firstname: "",
    othername: "",
    dateOfBirth: "",
    gender: "",

    // Step 2: Contact Details
    email: "",
    phone: "",

    // Step 3: Address Details (NEW STEP)
    address: "",
    city: "",
    state: "",
    lga: "",

    // Step 4: Identification
    idType: "nin",
    nin: "",
    bvn: "",

    // Step 5: Security
    password: "",
    confirmPassword: "",

    // Step 6: Agreement
    agreeToTerms: false,
    agreeToPrivacy: false,
    newsletter: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [lgas, setLgas] = useState<string[]>([]);
  const [lgaCache] = useState(new Map<string, string[]>());

  const steps = [
    { id: 1, title: "Personal Details", icon: <User className="w-5 h-5" /> },
    { id: 2, title: "Contact Info", icon: <Mail className="w-5 h-5" /> },
    { id: 3, title: "Address", icon: <MapPin className="w-5 h-5" /> }, // NEW STEP
    { id: 4, title: "Identification", icon: <FileText className="w-5 h-5" /> },
    { id: 5, title: "Security", icon: <Lock className="w-5 h-5" /> },
    { id: 6, title: "Agreement", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  // Fetch states on component mount
  useEffect(() => {
    const fetchStatesData = async () => {
      try {
        const cached = sessionStorage.getItem("cachedStates");
        if (cached) {
          setStates(JSON.parse(cached));
          return;
        }

        const res = await fetch("https://apinigeria.vercel.app/api/v1/states");
        const data = await res.json();
        const statesList = data.states || [];
        setStates(statesList);
        sessionStorage.setItem("cachedStates", JSON.stringify(statesList));
      } catch {
        console.error("Failed to load states");
      }
    };

    fetchStatesData();
  }, []);

  // Fetch LGAs when state changes
  useEffect(() => {
    const fetchLgasData = async () => {
      if (!formData.state) {
        setLgas([]);
        return;
      }

      if (lgaCache.has(formData.state)) {
        setLgas(lgaCache.get(formData.state) || []);
        return;
      }

      try {
        const res = await fetch(
          `https://apinigeria.vercel.app/api/v1/lga?state=${encodeURIComponent(
            formData.state
          )}`
        );
        const data = await res.json();
        const lgasList = data.lgas || [];
        setLgas(lgasList);
        lgaCache.set(formData.state, lgasList);
      } catch {
        console.error("Failed to load LGAs");
      }
    };

    fetchLgasData();
  }, [formData.state, lgaCache]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Reset LGA when state changes
    if (name === "state") {
      setFormData((prev) => ({ ...prev, lga: "" }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.surname.trim()) newErrors.surname = "Surname is required";
      if (!formData.firstname.trim())
        newErrors.firstname = "First name is required";
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
    }

    // NEW STEP VALIDATION
    if (step === 3) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }

      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }

      if (!formData.state) {
        newErrors.state = "Please select your state";
      }

      if (!formData.lga) {
        newErrors.lga = "Please select your LGA";
      }
    }

    if (step === 4) {
      if (formData.idType === "nin" && !formData.nin.trim()) {
        newErrors.nin = "NIN is required";
      } else if (formData.idType === "bvn" && !formData.bvn.trim()) {
        newErrors.bvn = "BVN is required";
      }
    }

    if (step === 5) {
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

    if (step === 6) {
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

        // Scroll to top of form on step change (not beginning of page)
        const formContainer = document.querySelector(".form-container");
        if (formContainer) {
          formContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);

      // Scroll to top of form on step change (not beginning of page)
      const formContainer = document.querySelector(".form-container");
      if (formContainer) {
        formContainer.scrollTo({ top: 0, behavior: "smooth" });
      }
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
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-lg overflow-hidden scroll-m-0 flex flex-col md:flex-row">
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

              {/* NEW STEP IN STORY */}
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Address Details</h3>
                  <p className="text-foreground/70 text-sm">
                    Where are you located?
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 mt-0.5">
                  4
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
                  5
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
                  6
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
        <div
          className="w-full md:w-3/5 p-6 md:p-8 form-container"
          style={{ maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}
        >
          {/* Mobile-only back to home button */}
          <div className="md:hidden mb-4 flex justify-between items-center">
            <Link
              href="/"
              className="text-primary hover:underline flex items-center text-sm"
            >
              <Home className="w-4 h-4 mr-1" /> Home
            </Link>
            <Link
              href="/signin"
              className="text-primary hover:underline text-sm"
            >
              Already have an account? Sign In
            </Link>
          </div>

          {/* Desktop sign in link */}
          <div className="hidden md:flex justify-end mb-4">
            <Link
              href="/signin"
              className="text-primary hover:underline text-sm"
            >
              Already have an account? Sign In
            </Link>
          </div>

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
              {currentStep === 3 && "Address Details"} {/* NEW STEP */}
              {currentStep === 4 && "Identity Verification"}
              {currentStep === 5 && "Security Setup"}
              {currentStep === 6 && "Terms & Conditions"}
            </h2>
            <p className="text-foreground/70">
              {currentStep === 1 && "Tell us a little about yourself"}
              {currentStep === 2 && "How can we reach you?"}
              {currentStep === 3 && "Where are you located?"} {/* NEW STEP */}
              {currentStep === 4 && "Verify your identity with NIN or BVN"}
              {currentStep === 5 && "Create a secure password"}
              {currentStep === 6 && "Review and accept our terms"}
            </p>
          </div>

          <form className="space-y-4">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Surname */}
                  <div>
                    <label
                      htmlFor="surname"
                      className="block text-sm font-medium mb-2"
                    >
                      Surname
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.surname ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your last name"
                    />
                    {errors.surname && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.surname}
                      </p>
                    )}
                  </div>
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstname"
                      className="block text-sm font-medium mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.firstname ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstname && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstname}
                      </p>
                    )}
                  </div>
                  {/* Other Name */}
                  <div>
                    <label
                      htmlFor="othername"
                      className="block text-sm font-medium mb-2"
                    >
                      Other Name
                    </label>
                    <input
                      type="text"
                      id="othername"
                      name="othername"
                      value={formData.othername}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.othername ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your other name (Optional)"
                    />
                    {errors.othername && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.othername}
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
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your email"
                    />
                  </div>
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
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-5 h-5" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.phone ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* NEW STEP: Address Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-2"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-foreground/50 w-5 h-5" />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.address ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your full address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-2"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.city ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
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
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lga"
                      className="block text-sm font-medium mb-2"
                    >
                      LGA
                    </label>
                    <select
                      id="lga"
                      name="lga"
                      value={formData.lga}
                      onChange={handleChange}
                      disabled={!formData.state}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.lga ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50`}
                    >
                      <option value="">Select LGA</option>
                      {lgas.map((lga) => (
                        <option key={lga} value={lga}>
                          {lga}
                        </option>
                      ))}
                    </select>
                    {errors.lga && (
                      <p className="mt-1 text-sm text-red-500">{errors.lga}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Identification */}
            {currentStep === 4 && (
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
                      maxLength={11}
                      value={formData.nin}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.nin ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      placeholder="Enter your 11-digit NIN"
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
                      maxLength={11}
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

            {/* Step 5: Security */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                        errors.password ? "border-red-500" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
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
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary/30`}
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

            {/* Step 6: Agreement */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Terms and Conditions</h3>
                  <div className="text-sm text-foreground/70 space-y-3">
                    <p>
                      Welcome to SecureID! By creating an account, you agree to
                      the following terms and conditions:
                    </p>

                    <h4 className="font-medium">1. Account Registration</h4>
                    <p>
                      You must provide accurate, current, and complete
                      information during the registration process. You are
                      responsible for maintaining the confidentiality of your
                      password and account information.
                    </p>

                    <h4 className="font-medium">2. Identity Verification</h4>
                    <p>
                      By providing your NIN or BVN, you authorize us to verify
                      your identity with the relevant government and financial
                      institutions. This information will be handled in
                      accordance with our privacy policy.
                    </p>

                    <h4 className="font-medium">3. Data Protection</h4>
                    <p>
                      We implement industry-standard security measures to
                      protect your personal information. However, no method of
                      transmission over the Internet is 100% secure, and we
                      cannot guarantee absolute security.
                    </p>

                    <h4 className="font-medium">4. Acceptable Use</h4>
                    <p>
                      You agree not to use the service for any unlawful purpose
                      or in any way that might harm, disable, overburden, or
                      impair the service.
                    </p>

                    <h4 className="font-medium">5. Service Modifications</h4>
                    <p>
                      We reserve the right to modify or discontinue, temporarily
                      or permanently, the service with or without notice at any
                      time.
                    </p>

                    <h4 className="font-medium">6. Governing Law</h4>
                    <p>
                      These terms shall be governed by and construed in
                      accordance with the laws of the Federal Republic of
                      Nigeria.
                    </p>

                    <p className="text-xs italic">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <span className="text-sm">
                        I agree to the Terms and Conditions
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.agreeToTerms}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeToPrivacy"
                        checked={formData.agreeToPrivacy}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <span className="text-sm">
                        I agree to the Privacy Policy and consent to the
                        processing of my personal data for identity verification
                        purposes
                      </span>
                    </label>
                    {errors.agreeToPrivacy && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.agreeToPrivacy}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <span className="text-sm">
                        I want to receive updates, security alerts, and
                        newsletters via email
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 text-foreground/70 hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentStep === steps.length ? (
                  <>
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                    {!isSubmitting && <Check className="w-5 h-5 ml-2" />}
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
