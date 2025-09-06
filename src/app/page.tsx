"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Zap,
  CheckCircle,
  FileText,
  Users,
  Search,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  Vote,
  Globe,
  Car,
  Phone,
  Globe2,
} from "lucide-react";

export default function GovLandingPage() {
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

  const services = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "NIN Slip Printing",
      description:
        "Download and print your NIN slip in multiple formats. Long, short, or premium options.",
      features: ["Multiple formats", "Instant download", "High-quality print"],
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "NIN Verification",
      description:
        "Verify NIN records using phone, email, tracking ID, or demographic information.",
      features: [
        "Multiple verification methods",
        "Real-time results",
        "Secure process",
      ],
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "BVN Verification",
      description:
        "Fast and accurate BVN lookup and validation using multiple verification methods.",
      features: [
        "Bank-grade security",
        "Instant validation",
        "Compliance guaranteed",
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Bulk Verification",
      description:
        "Verify multiple identities at once with our enterprise-grade bulk processing.",
      features: ["CSV upload", "Batch processing", "Detailed reports"],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Document Security",
      description:
        "Advanced encryption and security measures for all your sensitive documents.",
      features: [
        "Military-grade encryption",
        "Secure storage",
        "Access controls",
      ],
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Status Tracking",
      description:
        "Track your verification requests in real-time with our tracking system.",
      features: ["Real-time updates", "Notification alerts", "History logs"],
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Passport Verification",
      description:
        "Validate international passports with our secure verification system.",
      features: [
        "Global coverage",
        "Instant validation",
        "Multi-language support",
      ],
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Driver's License",
      description:
        "Verify FRSC-issued driver's licenses quickly and accurately.",
      features: [
        "Instant verification",
        "FRSC integration",
        "Real-time results",
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((currentTestimonial + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (currentTestimonial - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-card to-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Secure <span className="text-primary">Identity Verification</span>{" "}
              <br />
              Made Simple
            </h1>
            <p className="text-lg text-foreground/70 mb-10 max-w-3xl mx-auto">
              Verify, print, and manage your NIN and BVN documents with
              government-compliant security. Reliable, fast, and trusted.
            </p>
            <Link href="#">
              <div className="flex flex-col sm:flex-row gap-4 justify-center cursor-pointer">
                <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 transition">
                  Get Started Now <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 rounded-lg font-semibold hover:bg-card hover:text-primary flex items-center justify-center gap-2 transition">
                  <Play className="w-5 h-5" /> Watch Demo
                </button>
              </div>
            </Link>
          </div>
          {/* Verification Services Section */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary/10 w-full h-64 rounded-lg blur-3xl"></div>
            </div>
            <div className="relative bg-card rounded-2xl p-8 shadow-lg max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Verification Services</h2>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* NIN Printing */}
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">NIN Printing</span>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Instant slip generation
                  </p>
                </div>

                {/* NIN Verification */}
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      NIN Verification
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Multiple methods available
                  </p>
                </div>

                {/* BVN Services */}
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">BVN Services</span>
                  </div>
                  <p className="text-xs text-foreground/60">Fast and secure</p>
                </div>

                {/* Passport Verification */}
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      Passport Verification
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Validate international passports
                  </p>
                </div>

                {/* Driver’s License */}
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      Driver&apos;s License
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Check FRSC-issued licenses
                  </p>
                </div>

                {/* SIM Registration */}
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      SIM Registration
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Verify phone number identity
                  </p>
                </div>

                {/* Voter’s Card */}
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Vote className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      Voter&apos;s Card
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60">
                    INEC voter ID validation
                  </p>
                </div>

                {/* International Verification */}
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      International Verification
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Cross-border identity checks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-foreground/70 mt-2">Verified Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-foreground/70 mt-2">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-foreground/70 mt-2">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5min</div>
              <div className="text-foreground/70 mt-2">Avg. Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Comprehensive identity verification solutions tailored to your
              needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Simple, secure, and lightning-fast verification process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProcessStep
              step="01"
              title="Submit Request"
              description="Provide your NIN, BVN, or tracking ID through our secure portal."
              icon={<FileText className="w-8 h-8" />}
            />
            <ProcessStep
              step="02"
              title="Secure Processing"
              description="We process your request with trusted government providers."
              icon={<Shield className="w-8 h-8" />}
            />
            <ProcessStep
              step="03"
              title="Get Results"
              description="Download slips or verify records instantly with real-time updates."
              icon={<Download className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Trusted by individuals and businesses across the country
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-lg text-foreground mb-6 italic">
                  &quot;{testimonials[currentTestimonial].text}&quot;
                </p>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-foreground/70 text-sm">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-3">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full hover:bg-card"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentTestimonial
                        ? "bg-primary"
                        : "bg-foreground/20"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full hover:bg-card"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-card to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-foreground/70 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust our verification
            services
          </p>
          <Link href="/signup">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition">
                Create Account
              </button>
            </div>
          </Link>
          <Link href="#">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 rounded-lg font-semibold hover:bg-card hover:text-primary transition mt-5">
                Contact Sales
              </button>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
};

function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 group hover:shadow-lg transition">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-foreground/70 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm text-foreground/70"
          >
            <Check className="w-4 h-4 text-primary" /> {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

type ProcessStepProps = {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

function ProcessStep({ step, title, description, icon }: ProcessStepProps) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
        {icon}
      </div>
      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mx-auto mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
}
