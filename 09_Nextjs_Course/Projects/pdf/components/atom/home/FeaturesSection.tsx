'use client';

import { motion } from 'motion/react';
import { Shield, Zap, Lock, CheckCircle2, Sparkles, Globe } from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Shield,
    title: 'Privacy-First',
    description:
      'All processing happens in your browser. Your files never leave your device, ensuring complete privacy and security.',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Process PDFs instantly without waiting for uploads or server processing. Get results in seconds, not minutes.',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  {
    icon: Lock,
    title: 'No File Uploads',
    description:
      'Your documents stay on your computer. We never see, store, or have access to your files. Complete data sovereignty.',
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
  {
    icon: CheckCircle2,
    title: 'Free Forever',
    description:
      'All our essential PDF tools are completely free to use. No hidden fees, no subscriptions, no credit card required.',
    gradient: 'from-green-500/20 to-green-500/5',
  },
  {
    icon: Sparkles,
    title: 'No Limits',
    description:
      'Process as many files as you need, as large as you want. No file size restrictions or daily usage limits.',
    gradient: 'from-orange-500/20 to-orange-500/5',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description:
      'Access all tools from any device, anywhere. Works seamlessly on desktop, tablet, and mobile browsers.',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
  },
];

export function FeaturesSection() {
  // Animation Variants for Staggered Text
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="relative w-full overflow-hidden border-b bg-background py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2  bg-primary/5 opacity-50 blur-[120px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Why Choose Us?
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Built with your privacy and convenience in mind. Experience the difference of truly
            secure, client-side PDF processing.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: {
                    duration: 0.3,
                  },
                }}
                className="group relative">
                <div className="relative h-full  border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0  bg-linear-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-4 inline-flex items-center justify-center  bg-primary/10 p-3 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-primary transition-colors duration-300" />
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-xl font-bold text-foreground transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0  bg-primary/0 transition-all duration-300 group-hover:bg-primary/5" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">100% Free</span> •{' '}
            <span className="font-semibold text-foreground">No Registration</span> •{' '}
            <span className="font-semibold text-foreground">No Data Collection</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
