import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Shield, Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div
              className={`p-2 rounded-full mr-2 ${isScrolled || location.pathname !== "/" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
            >
              <Shield className="h-6 w-6" />
            </div>
            <span
              className={`text-xl font-bold ${isScrolled || location.pathname !== "/" ? "text-blue-600" : "text-white"}`}
            >
              ParentConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/#features"
              isScrolled={isScrolled}
              currentPath={location.pathname}
            >
              Features
            </NavLink>
            <NavLink
              to="/pricing"
              isScrolled={isScrolled}
              currentPath={location.pathname}
            >
              Pricing
            </NavLink>
            <NavLink
              to="/contact"
              isScrolled={isScrolled}
              currentPath={location.pathname}
            >
              Contact
            </NavLink>
            <NavLink
              to="/about"
              isScrolled={isScrolled}
              currentPath={location.pathname}
            >
              About
            </NavLink>

            <div className="flex items-center space-x-2">
              <Button
                asChild
                variant="ghost"
                className={
                  isScrolled || location.pathname !== "/"
                    ? ""
                    : "text-white hover:bg-white/20"
                }
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className={
                  isScrolled || location.pathname !== "/"
                    ? "bg-blue-600"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }
              >
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X
                className={`h-6 w-6 ${isScrolled || location.pathname !== "/" ? "text-blue-600" : "text-white"}`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 ${isScrolled || location.pathname !== "/" ? "text-blue-600" : "text-white"}`}
              />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 bg-white rounded-lg mt-2 shadow-lg">
            <div className="flex flex-col space-y-3 p-4">
              <MobileNavLink to="/#features">Features</MobileNavLink>
              <MobileNavLink to="/pricing">Pricing</MobileNavLink>
              <MobileNavLink to="/contact">Contact</MobileNavLink>
              <MobileNavLink to="/about">About</MobileNavLink>
              <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
                <Button asChild variant="outline">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const NavLink = ({
  to,
  children,
  isScrolled,
  currentPath,
}: {
  to: string;
  children: React.ReactNode;
  isScrolled: boolean;
  currentPath: string;
}) => {
  const isHomePage = currentPath === "/";
  const textColor =
    isScrolled || !isHomePage
      ? "text-gray-700 hover:text-blue-600"
      : "text-white hover:text-blue-100";

  return (
    <Link to={to} className={`font-medium ${textColor}`}>
      {children}
    </Link>
  );
};

const MobileNavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      to={to}
      className="text-gray-700 hover:text-blue-600 font-medium py-2"
    >
      {children}
    </Link>
  );
};

export default Header;
