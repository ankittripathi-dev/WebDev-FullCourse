import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-background/50 backdrop-blur border-t">
      <div className="max-w-7xl mx-auto px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} ankitripathi.dev. All rights reserved.
        </p>

        <div className="flex gap-5 text-sm">
          <Link href="/" className="hover:text-white transition">
            Privacy Policy
          </Link>

          <Link href="/about" className="hover:text-white transition">
            About Us
          </Link>

          <Link href="/contact" className="hover:text-white transition">
            Help Center
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
