import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-foreground/10 bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">i3ClearID</span>
            </div>
            <p className="text-foreground/70">
              Secure identity verification powered by I3Hub technology.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <div className="space-y-2 text-foreground/70">
              <div>NIN Verification</div>
              <div>BVN Verification</div>
              <div>Document Printing</div>
              <div>Status Tracking</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-foreground/70">
              <div>Help Center</div>
              <div>API Documentation</div>
              <div>Contact Support</div>
              <div>System Status</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-2 text-foreground/70">
              <div>About I3Hub</div>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
              <div>Security</div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="border-t border-foreground/10 pt-8 text-center text-foreground/60">
          {/* © {new Date().getFullYear()} i3ClearID · Part of{" "} */}
          <span className="text-primary font-semibold">i3ClearID</span>
        </div>
      </div>
    </footer>
  );
}
