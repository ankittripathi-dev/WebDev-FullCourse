'use client';

import { motion } from 'motion/react';
import { FileText, Users, Target, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AboutHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const rightItemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <section className="relative w-full overflow-hidden border-b bg-background pt-20 pb-16 lg:pt-32 lg:pb-24">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 opacity-40 blur-[100px]"></div>
        <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 opacity-40 blur-[100px]"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8">
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
                <Sparkles className="h-3 w-3 mr-2" />
                About Freedf
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-tight">
                Built by Developers,
                <br />
                <span className="bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  For Everyone
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                We're two passionate developers who believe PDF tools should be free, private, and
                powerful. Every feature is built with your privacy in mind - your files never leave
                your device.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4">
              <Button
                size="lg"
                className="h-12 px-8"
                asChild>
                <Link href="#team">
                  Meet the Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8"
                asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Visual Element */}
          <motion.div
            variants={rightItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative h-[400px] w-full hidden lg:block">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />

            {/* Code Window (Back) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-4 w-3/4 max-w-[450px] border border-border bg-card shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              {/* Code Content */}
              <div className="p-6 space-y-3 font-mono text-sm opacity-60">
                <div className="flex gap-2">
                  <span className="text-purple-500">const</span>
                  <span className="text-blue-500">pdfEngine</span>
                  <span>=</span>
                  <span className="text-orange-500">new</span>
                  <span className="text-yellow-600">Freedf</span>
                  <span>();</span>
                </div>
                <div className="flex gap-2 pl-4">
                  <span className="text-purple-500">await</span>
                  <span className="text-blue-500">pdfEngine</span>
                  <span>.</span>
                  <span className="text-yellow-600">process</span>
                  <span>({'{'}</span>
                </div>
                <div className="pl-8 flex gap-2">
                   <span className="text-foreground">secure:</span>
                   <span className="text-blue-500">true</span>,
                </div>
                <div className="pl-8 flex gap-2">
                   <span className="text-foreground">clientSide:</span>
                   <span className="text-blue-500">true</span>,
                </div>
                <div className="pl-4"><span>{'}'});</span></div>
              </div>
            </motion.div>

            {/* PDF Card (Front) */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-12 left-4 w-[280px] border border-white/10 bg-black/90 p-5 shadow-2xl backdrop-blur-md text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10  bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="h-2.5 w-24 rounded bg-white/90 mb-1.5" />
                  <div className="h-2 w-16 rounded bg-white/40" />
                </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs text-white/50 font-medium">
                    <span>Compressing...</span>
                    <span className="text-green-400">100%</span>
                 </div>
                 <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-full bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                 </div>
              </div>
            </motion.div>

            {/* Floating Badge */}
             <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[40%] left-[30%]">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-background/80 shadow-xl backdrop-blur-md">
                   <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                   <span className="text-xs font-semibold text-foreground">Secure Core Active</span>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
