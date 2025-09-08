import { Button } from "@/components/ui/button";
import {
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">UniConnect</h3>
                <p className="text-sm text-primary-foreground/80">
                  University Community System
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Empowering university communities through seamless digital
              connections, fostering collaboration, and building stronger bonds.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#blood-donation"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  Blood Donation
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  Event Management
                </a>
              </li>
              <li>
                <a
                  href="#tours"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  Group Tours
                </a>
              </li>
              <li>
                <a
                  href="#jobs"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  Job Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4" />
                <span className="text-primary-foreground/80">
                  dragonsayem77@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4" />
                <span className="text-primary-foreground/80">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="text-primary-foreground/80">
                  Southern University Bangladesh, Arefin Nagar, Bayezid Bostami,
                  Chattogram.
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/80 hover:text-white hover:bg-white/10"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/80 hover:text-white hover:bg-white/10"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/80 hover:text-white hover:bg-white/10"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/80 hover:text-white hover:bg-white/10"
              >
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/80 text-sm">
            © 2024 UniConnect. All rights reserved. Built with ❤️ for university
            communities.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
