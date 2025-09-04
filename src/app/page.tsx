"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Shield, Zap, Globe, CheckCircle, ArrowRight, Menu, X, Star } from 'lucide-react';

export default function ModernLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { name: "Sarah O.", role: "Business Owner", text: "Fast and reliable NIN verification. Saved me hours of paperwork!" },
    { name: "David M.", role: "HR Manager", text: "The bulk verification feature is a game-changer for our recruitment process." },
    { name: "Amina K.", role: "Freelancer", text: "Simple interface and instant results. Highly recommended!" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl' : 'bg-transparent'
      }`}>
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
              <a href="#services" className="text-slate-300 hover:text-white transition-colors">Services</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How it Works</a>
              <a href="#status" className="text-slate-300 hover:text-white transition-colors">Status</a>
              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-700">
            <div className="px-6 py-4 space-y-4">
              <a href="#services" className="block text-slate-300 hover:text-white transition-colors">Services</a>
              <a href="#how-it-works" className="block text-slate-300 hover:text-white transition-colors">How it Works</a>
              <a href="#status" className="block text-slate-300 hover:text-white transition-colors">Status</a>
              <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2 rounded-full font-semibold">
                Get Started
              </button>
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
              <span className="text-sm text-slate-300">Powered by I3Hub Technology</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent leading-tight">
              Secure Identity
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Verification
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Print, verify, and track your NIN and BVN details with cutting-edge security.
              Government-compliant and lightning-fast.
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
              Everything you need for secure identity verification and document management
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
              How It <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-slate-400">Simple, secure, and lightning-fast verification process</p>
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
            What Our <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Users Say</span>
          </h2>
          
          <div className="relative h-48">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === currentTestimonial ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
                }`}
              >
                <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700">
                  <p className="text-lg text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                  <div className="font-semibold text-white">{testimonial.name}</div>
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
                  index === currentTestimonial ? 'bg-emerald-400' : 'bg-slate-600'
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
              Join thousands of users who trust i3ClearID for secure, reliable, and government-compliant identity services.
            </p>
            <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
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
              <p className="text-slate-400">Secure identity verification powered by I3Hub technology.</p>
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
            <p>© {new Date().getFullYear()} i3ClearID · Part of <span className="text-emerald-400 font-semibold">I3Hub</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

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

function FeatureCard({ icon, title, description, gradient }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105">
      <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:shadow-lg transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ProcessStep({ step, title, description }: {
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