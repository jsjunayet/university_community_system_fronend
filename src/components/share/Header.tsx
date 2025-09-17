"use client";
import { Button } from "@/components/ui/button";
import { Bell, GraduationCap, Mail, Menu, Phone, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ import hook
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // ✅ current route

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const linkClasses = (href: string) =>
    `transition-colors ${
      pathname === href
        ? "text-primary font-semibold border-b-2 border-primary " // ✅ active style
        : "text-foreground hover:text-primary"
    }`;

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">UniConnect</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                University Community System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClasses(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-1">
                <User className="w-4 h-4" />
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-border mt-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 px-3 rounded-md ${linkClasses(
                    item.href
                  )}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-border space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                </Link>

                <div className="pt-2 space-y-1">
                  <a
                    href="tel:+1-555-0100"
                    className="flex items-center gap-2 py-2 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call: +1-555-0100
                  </a>
                  <a
                    href="mailto:contact@uniconnect.edu"
                    className="flex items-center gap-2 py-2 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    contact@uniconnect.edu
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
