import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Heart, Facebook, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const popularTools = [
    { label: 'Merge PDF', href: '/tools/merge-pdf' },
    { label: 'Split PDF', href: '/tools/split-pdf' },
    { label: 'Compress PDF', href: '/tools/compress-pdf' },
    { label: 'JPG to PDF', href: '/tools/jpg-to-pdf' },
    { label: 'PDF to JPG', href: '/tools/pdf-to-jpg' },
    { label: 'Rotate PDF', href: '/tools/rotate-pdf' },
  ];

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://www.facebook.com/profile.php?id=61586605283910&mibextid=ZbWKwL',
      label: 'Facebook',
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/freedf.in?igsh=MWswY2Ftbmw3MmhuNQ==',
      label: 'Instagram',
    },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="mb-4 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Freedf"
                width={200}
                height={150}
                className=""
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your all-in-one PDF solution. Fast, secure, and privacy-focused tools for all your PDF
              needs. Process files instantly in your browser.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={social.label}>
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Popular Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide">
              Popular Tools
            </h3>
            <ul className="space-y-2">
              {popularTools.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© {currentYear} Freedf. All rights reserved.</p>
            <p className="flex items-center justify-center gap-1">
              Made with <Heart className="h-4 w-4 text-accent" /> for PDF enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
