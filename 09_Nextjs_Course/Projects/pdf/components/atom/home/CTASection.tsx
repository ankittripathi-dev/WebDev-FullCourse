'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <section className="relative w-full overflow-hidden border-b bg-background py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div
          className="absolute right-1/4 top-1/4 h-[400px] w-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '1s' }}></div>
        <div
          className="absolute left-1/4 bottom-1/4 h-[400px] w-[400px] bg-purple-500/8 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '2s' }}></div>

        {/* Subtle Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_60%)]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Ready to Transform Your PDFs?
            </span>
          </h2>

          {/* Description */}
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who trust our tools for their PDF needs. Get started in seconds
            - no signup required, completely free, and your files stay private.
          </p>

          {/* CTA Buttons */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 px-8 text-base transition-all hover:scale-105 group"
              asChild>
              <Link href="/tools/merge-pdf">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base hover:bg-muted/60 hover:text-foreground transition-all hover:scale-105"
              asChild>
              <Link href="#tools-grid">
                Explore All Tools
                <Zap className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-green-500"></div>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-blue-500"></div>
              <span>No Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-purple-500"></div>
              <span>Privacy-First</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-orange-500"></div>
              <span>No Limits</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
