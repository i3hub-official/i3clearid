"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Menu,
  X,
  User,
  FileText,
  Phone,
  Moon,
  Sun,
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = saved || (prefersDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!theme) return;
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary select-none">
              i3<span className="text-secondary">ClearID</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#services"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Testimonials
            </Link>
            <Link
              href="#contact"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Mobile Theme Toggle */}
            {mounted && (
              <div className="md:hidden">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-background text-foreground border-2 border-background 
                           hover:bg-background/10 transition-colors focus:outline-none focus:ring-0 
                           focus:ring-background focus:ring-offset-0 focus:ring-offset-background"
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {theme === "dark" ? (
                    <Sun
                      className="w-5 h-5 transform transition-transform duration-300 ease-in-out rotate-180 scale-110 hover:scale-125 hover:rotate-12
"
                    />
                  ) : (
                    <Moon
                      className="w-5 h-5 transform transition-transform duration-300 ease-in-out rotate-0 scale-110 hover:scale-125 hover:rotate-12
"
                    />
                  )}
                </button>
              </div>
            )}

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-3">
                {/* Sign In button */}
                <Link href="/signin">
                  <button className="bg-transparent hover:bg-primary/10 text-foreground font-medium py-2 px-4 rounded-md transition flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </button>
                </Link>

                {/* Get Started button */}
                <Link href="/signup">
                  <button className="bg-primary text-white font-medium py-2 px-5 rounded-md hover:bg-primary/90 transition inline-block">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Desktop Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-background text-foreground border-2 border-background
                           hover:bg-background/10 transition-colors focus:outline-none focus:ring-0
                           focus:ring-background focus:ring-offset-0 focus:ring-offset-background"
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground p-2"
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border">
            <div className="px-2 pt-2 pb-4 space-y-2">
              {[
                {
                  href: "#services",
                  label: "Services",
                  icon: <FileText className="w-4 h-4 inline mr-2" />,
                },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#testimonials", label: "Testimonials" },
                {
                  href: "#contact",
                  label: "Contact",
                  icon: <Phone className="w-4 h-4 inline mr-2" />,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-foreground hover:bg-primary/10 hover:text-primary transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-border mt-2 space-y-2">
                {/* Sign In button */}
                <Link
                  href="/signin"
                  className="block bg-transparent hover:bg-primary/10 text-foreground font-medium py-2 px-4 rounded-md transition flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" /> Sign In
                </Link>

                {/* Get Started button */}
                <Link
                  href="/signup"
                  className="block bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary/90 transition text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
