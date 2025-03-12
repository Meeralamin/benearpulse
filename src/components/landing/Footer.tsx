import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <div className="bg-white text-blue-600 p-2 rounded-full mr-2">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">ParentConnect</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Keeping parents connected with their children through secure,
              real-time video monitoring.
            </p>
            <div className="flex space-x-4">
              <SocialLink
                href="#"
                icon={<Facebook className="h-5 w-5" />}
                label="Facebook"
              />
              <SocialLink
                href="#"
                icon={<Twitter className="h-5 w-5" />}
                label="Twitter"
              />
              <SocialLink
                href="#"
                icon={<Instagram className="h-5 w-5" />}
                label="Instagram"
              />
              <SocialLink
                href="#"
                icon={<Linkedin className="h-5 w-5" />}
                label="LinkedIn"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/press">Press</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/affiliate-program">Affiliate Program</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/cookies">Cookie Policy</FooterLink>
              <FooterLink to="/compliance">Compliance</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ParentConnect. All rights
            reserved.
          </p>
          <div className="flex justify-center md:justify-end space-x-6">
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white text-sm"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white text-sm"
            >
              Privacy
            </Link>
            <Link
              to="/cookies"
              className="text-gray-400 hover:text-white text-sm"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <li>
      <Link
        to={to}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {children}
      </Link>
    </li>
  );
};

const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <a
      href={href}
      className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

export default Footer;
