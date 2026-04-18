'use client';

import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Priya Sharma',
    content:
      'I love that my files never leave my computer. As a lawyer, confidentiality is key, and Freedf\'s client-side processing gives me 100% peace of mind.',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'Rahul Verma',
    content:
      'Finally, a free tool without annoying file size limits! I merged a 200MB report effortlessly. The drag-and-drop interface is super smooth too.',
    rating: 5,
    avatar: 'RV',
  },
  {
    name: 'Ananya Gupta',
    content:
      'The compression tool is magic. Reduced my portfolio size by 80% without losing image quality. Essential for submitting my design applications.',
    rating: 5,
    avatar: 'AG',
  },
  {
    name: 'Vikram Singh',
    content:
      'No logins, no watermarks, just fast PDF tools. I typically spend hours organizing invoices, but the Split PDF tool cut my work time in half.',
    rating: 5,
    avatar: 'VS',
  },
  {
    name: 'Neha Patel',
    content:
      'It works perfectly offline! I was on a flight with no Wi-Fi and could still convert and edit my documents. This is a game changer for travelers.',
    rating: 5,
    avatar: 'NP',
  },
  {
    name: 'Arjun Mehta',
    content:
      'Cleanest interface I\'ve seen. Most converters are cluttered with ads, but this is sleek and professional. The dark mode is a nice bonus!',
    rating: 5,
    avatar: 'AM',
  },
];

export function TestimonialsSection() {
  // Animation Variants
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
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 bg-purple-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)]"></div>
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
              Loved by Thousands
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            See what our users are saying about their experience with our PDF tools.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
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
              <div className="relative h-full border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                {/* Quote Icon */}
                <div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="h-12 w-12 text-primary" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Stars Rating */}
                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'fill-primary text-primary'
                            : 'fill-muted text-muted-foreground/30'
                        } transition-colors duration-300`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="mb-6 text-sm leading-relaxed text-foreground">
                    "{testimonial.content}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center border border-border bg-primary/10 text-sm font-bold text-primary">
                      {testimonial.avatar}
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-primary/0 transition-all duration-300 group-hover:bg-primary/5" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-foreground">10,000+</p>
            <p className="text-sm text-muted-foreground">Happy Users</p>
          </div>
          <div className="h-12 w-px bg-border"></div>
          <div>
            <p className="text-3xl font-bold text-foreground">4.9/5</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
          <div className="h-12 w-px bg-border"></div>
          <div>
            <p className="text-3xl font-bold text-foreground">500K+</p>
            <p className="text-sm text-muted-foreground">Files Processed</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

