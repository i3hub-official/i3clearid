"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Star,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
} from "lucide-react";

// Main App Component that handles routing
export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  const renderPage = () => {
    switch (currentPage) {
      case "signin":
        return <SignInPage setCurrentPage={setCurrentPage} />;
      case "signup":
        return <SignUpPage setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {renderPage()}
    </div>
  );
}

// StatCard Component
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-slate-400">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105">
      <div
        className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:shadow-lg transition-all duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ProcessStep({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center relative">
      <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg shadow-emerald-500/25">
        {step}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

// Landing Page Component
function LandingPage({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah O.",
      role: "Business Owner",
      text: "Fast and reliable NIN verification. Saved me hours of paperwork!",
    },
    {
      name: "David M.",
      role: "HR Manager",
      text: "The bulk verification feature is a game-changer for our recruitment process.",
    },
    {
      name: "Amina K.",
      role: "Freelancer",
      text: "Simple interface and instant results. Highly recommended!",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-lg shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                i3ClearID
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#services"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Services
              </a>
              <a
                href="#how-it-works"
                className="text-slate-300 hover:text-white transition-colors"
              >
                How it Works
              </a>
              <a
                href="#status"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Status
              </a>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentPage("signin")}
                  className="text-slate-300 hover:text-white transition-colors font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentPage("signup")}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </button>
              </div>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-700">
            <div className="px-6 py-4 space-y-4">
              <a
                href="#services"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                Services
              </a>
              <a
                href="#how-it-works"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                How it Works
              </a>
              <a
                href="#status"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                Status
              </a>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setCurrentPage("signin")}
                  className="w-full text-left text-slate-300 hover:text-white transition-colors font-semibold py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentPage("signup")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2 rounded-full font-semibold"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-lg px-4 py-2 rounded-full mb-8 border border-slate-700">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">
                Powered by I3Hub Technology
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent leading-tight">
              Secure Identity
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Verification
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Print, verify, and track your NIN and BVN details with
              cutting-edge security. Government-compliant and lightning-fast.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center justify-center">
                  Explore Services
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-slate-600 hover:border-emerald-400 hover:bg-slate-800/50 transition-all duration-300">
                Check Status
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <StatCard number="50K+" label="Verifications" />
              <StatCard number="99.9%" label="Uptime" />
              <StatCard number="< 30s" label="Avg Response" />
              <StatCard number="24/7" label="Support" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need for secure identity verification and document
              management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="NIN Slip Printing"
              description="Download and print your NIN slip in multiple formats. Long, short, standard, or premium options available."
              gradient="from-emerald-500 to-green-600"
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8" />}
              title="NIN Verification"
              description="Verify NIN records using phone, email, tracking ID, or demographic information with instant results."
              gradient="from-cyan-500 to-blue-600"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="BVN Verification"
              description="Fast and accurate BVN lookup and validation using multiple verification methods."
              gradient="from-purple-500 to-indigo-600"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Status Tracking"
              description="Real-time tracking of your verification requests with unique reference IDs and progress updates."
              gradient="from-orange-500 to-red-600"
            />
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="Smart Notifications"
              description="Instant email and SMS alerts when your requests are completed. Never miss an update."
              gradient="from-pink-500 to-rose-600"
            />
            <FeatureCard
              icon={<ChevronRight className="w-8 h-8" />}
              title="Future Ready"
              description="Driver's License, Passport, and PVC verification features launching soon. Stay ahead."
              gradient="from-teal-500 to-cyan-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Simple, secure, and lightning-fast verification process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProcessStep
              step="01"
              title="Submit Request"
              description="Provide your NIN, BVN, phone number, or tracking ID through our secure interface."
            />
            <ProcessStep
              step="02"
              title="Secure Processing"
              description="We process your request through trusted government providers using advanced encryption."
            />
            <ProcessStep
              step="03"
              title="Get Results"
              description="Download slips, verify records, or check request status instantly with real-time updates."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">
            What Our{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>

          <div className="relative h-48">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === currentTestimonial
                    ? "opacity-100 transform scale-100"
                    : "opacity-0 transform scale-95"
                }`}
              >
                <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700">
                  <p className="text-lg text-slate-300 mb-4 italic">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-emerald-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonial
                    ? "bg-emerald-400"
                    : "bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-lg p-12 rounded-3xl border border-emerald-500/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust i3ClearID for secure, reliable,
              and government-compliant identity services.
            </p>
            <button
              onClick={() => setCurrentPage("signup")}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Start Verification Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  i3ClearID
                </span>
              </div>
              <p className="text-slate-400">
                Secure identity verification powered by I3Hub technology.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Services</h3>
              <div className="space-y-2 text-slate-400">
                <div>NIN Verification</div>
                <div>BVN Verification</div>
                <div>Document Printing</div>
                <div>Status Tracking</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <div className="space-y-2 text-slate-400">
                <div>Help Center</div>
                <div>API Documentation</div>
                <div>Contact Support</div>
                <div>System Status</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <div className="space-y-2 text-slate-400">
                <div>About I3Hub</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Security</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>
              © {new Date().getFullYear()} i3ClearID · Part of{" "}
              <span className="text-emerald-400 font-semibold">I3Hub</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

// Sign In Page Component
function SignInPage({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-3xl"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

      {/* Back Button */}
      <button
        onClick={() => setCurrentPage("landing")}
        className="absolute top-8 left-8 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors z-10"
      >
        <ArrowRight className="w-5 h-5 rotate-180" />
        <span>Back to Home</span>
      </button>

      {/* Sign In Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-3xl border border-slate-700 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              i3ClearID
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Sign In
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-700 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-700 transition-colors">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => setCurrentPage("signup")}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Sign up here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// InputField Component
function InputField({
  label,
  name,
  type,
  value,
  onChange,
  required,
  showToggle,
  onToggle,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="relative">
      <label className="block text-sm text-slate-400 mb-1" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        {name === "email" && (
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        {name === "phone" && (
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        {(name === "password" || name === "confirmPassword") && (
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        {(name === "firstName" || name === "lastName") && (
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-${
            showToggle ? "12" : "4"
          } py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all`}
          placeholder={label}
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {type === "password" ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Sign Up Page Component
function SignUpPage({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Sign up submitted:", formData);
  };

  // Render the Sign Up Form
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-3xl"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

      {/* Back Button */}
      <button
        onClick={() => setCurrentPage("landing")}
        className="absolute top-8 left-8 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors z-10"
      >
        <ArrowRight className="w-5 h-5 rotate-180" />
        <span>Back to Home</span>
      </button>

      {/* Sign Up Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <h2 className="text-lg font-semibold mb-6">Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <InputField
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                showToggle
                onToggle={() => setShowPassword(!showPassword)}
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                showToggle
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  className="mr-2"
                />
                <label className="text-sm text-slate-400">
                  I agree to the terms and conditions
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-lg"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-slate-400">
        Already have an account?{" "}
        <button
          onClick={() => setCurrentPage("login")}
          className="text-emerald-500 hover:text-emerald-600 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
