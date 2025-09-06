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
    <footer className="bg-card pt-16 pb-6 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand + Story */}
          <div>
            <h3 className="text-2xl font-extrabold mb-4 select-none tracking-tight">
              <span className="text-primary">i3Hub</span>
              <span className="text-secondary"> | </span>
              <span className="text-primary">i3ClearID</span>
            </h3>
            <p className="text-foreground/70 mb-6 text-sm leading-relaxed">
              <span className="font-semibold text-primary">i3Hub</span> builds
              technology that powers{" "}
              <span className="font-semibold text-primary">i3ClearID</span>, a
              secure digital identity platform. Protected end-to-end by{" "}
              <span className="font-semibold text-secondary">SecureID</span>.
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

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-foreground/70">
                <Phone className="w-4 h-4 shrink-0" /> +234 800 123 4567
              </li>
              <li className="flex items-center gap-2 text-foreground/70">
                <Mail className="w-4 h-4 shrink-0" /> support@i3clearid.ng
              </li>
              <li className="flex items-center gap-2 text-foreground/70">
                <MapPin className="w-4 h-4 shrink-0" /> Abuja, Nigeria
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-6 border-t border-border text-center text-foreground/60 text-xs sm:text-sm select-none">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-primary">i3Hub</span> ·{" "}
            <span className="text-primary">i3ClearID</span> powered by{" "}
            <span className="text-secondary font-bold">SecureID</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
