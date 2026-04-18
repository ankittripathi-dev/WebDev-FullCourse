'use client';

import { motion } from 'motion/react';
import { Shield, Zap, Heart, Globe } from 'lucide-react';

interface Value {
  icon: React.ElementType;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'Your data belongs to you. We process everything locally in your browser, ensuring complete privacy and security.',
  },
  {
    icon: Zap,
    title: 'Fast & Efficient',
    description:
      'No uploads, no waiting. Process PDFs instantly with client-side technology for lightning-fast results.',
  },
  {
    icon: Heart,
    title: 'Free Forever',
    description:
      'We believe powerful tools should be accessible to everyone. All our essential features are completely free.',
  },
  {
    icon: Globe,
    title: 'Open & Transparent',
    description:
      "Built with open-source technologies. We're transparent about how our tools work and what they do.",
  },
];

export function MissionSection() {
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
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/5 opacity-50 blur-[120px]"></div>
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
              Our Mission & Values
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We're committed to making PDF management simple, secure, and accessible to everyone,
            everywhere.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 max-w-3xl mx-auto text-center">
          <p className="text-xl leading-relaxed text-foreground">
            At PDF Master, we believe that powerful tools should be{' '}
            <span className="font-semibold text-primary">free</span>,{' '}
            <span className="font-semibold text-primary">private</span>, and{' '}
            <span className="font-semibold text-primary">accessible</span> to everyone. We're
            building the future of PDF management - one that respects your privacy and puts you in
            control.
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
                whileHover={{
                  y: -4,
                  transition: {
                    duration: 0.3,
                  },
                }}
                className="group relative">
                <div className="relative h-full border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                  {/* Icon */}
                  <div className="mb-4 inline-flex items-center justify-center border border-primary/20 bg-primary/10 p-3 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-primary transition-colors duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold text-foreground transition-colors duration-300">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-300">
                    {value.description}
                  </p>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-primary/0 transition-all duration-300 group-hover:bg-primary/5" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

