"use client";

import React, { useState, useEffect } from "react";
import { Shield, Zap, CheckCircle } from "lucide-react";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="pb-20 pt-32 px-9 bg-background border-b border-foreground/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight text-primary">
            Secure Identity Verification
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            Print, verify, and track your NIN and BVN details with
            government-compliant security. Reliable, simple, and fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700">
              Explore Services
            </button>
            <button className="px-8 py-3 rounded-md font-semibold border border-gray-300 hover:border-green-600 hover:text-primary">
              Check Status
            </button>
          </div>
        </div>
      </section>
      {/* Services */}
      <section id="services" className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted tools for identity verification and document management
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-green-600" />}
            title="NIN Slip Printing"
            description="Download and print your NIN slip in multiple formats. Long, short, or premium options."
          />
          <FeatureCard
            icon={<CheckCircle className="w-8 h-8 text-green-600" />}
            title="NIN Verification"
            description="Verify NIN records using phone, email, tracking ID, or demographic information."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-green-600" />}
            title="BVN Verification"
            description="Fast and accurate BVN lookup and validation using multiple verification methods."
          />
        </div>
      </section>
      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-6 bg-background border-t border-b border-foreground/20"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-gray-600">
            Simple, secure, and lightning-fast verification process
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <ProcessStep
            step="01"
            title="Submit Request"
            description="Provide your NIN, BVN, or tracking ID through our secure portal."
          />
          <ProcessStep
            step="02"
            title="Secure Processing"
            description="We process your request with trusted government providers."
          />
          <ProcessStep
            step="03"
            title="Get Results"
            description="Download slips or verify records instantly with real-time updates."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background border border-foreground/20 rounded-lg p-6 text-left shadow-sm hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-primary">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
