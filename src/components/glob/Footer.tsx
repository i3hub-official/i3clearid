import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-lg font-semibold mb-4 select-none">
              <span className="text-primary">i3</span>
              <span className="text-secondary">ClearID</span>
            </h3>
            <p className="text-foreground/70 mb-6">
              Secure identity verification services for individuals and
              businesses.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-foreground/70 hover:text-primary">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary">
                  NIN Slip Printing
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary">
                  NIN Verification
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary">
                  BVN Verification
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary">
                  Bulk Processing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-foreground/70">
                <Phone className="w-4 h-4" /> +234 800 123 4567
              </li>
              <li className="flex items-center gap-2 text-foreground/70">
                <Mail className="w-4 h-4" /> support@i3clearid.ng
              </li>
              <li className="flex items-center gap-2 text-foreground/70">
                <MapPin className="w-4 h-4" /> Abuja, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center text-foreground/70 text-sm select-none">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-primary">i3</span>
            <span className="text-secondary">ClearID</span>. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
