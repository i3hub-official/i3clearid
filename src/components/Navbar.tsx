"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">i3ClearID</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#services"
            className="hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-primary transition-colors"
          >
            How it Works
          </Link>
          <Link href="#status" className="hover:text-primary transition-colors">
            Status
          </Link>
          <button className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-all">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-foreground/10">
          <div className="px-6 py-4 space-y-4">
            <Link href="#services" className="block hover:text-primary">
              Services
            </Link>
            <Link href="#how-it-works" className="block hover:text-primary">
              How it Works
            </Link>
            <Link href="#sign-in" className="block hover:text-primary">
              Sign in
            </Link>
            <button className="w-full bg-primary text-white px-6 py-2 rounded-full font-semibold">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
