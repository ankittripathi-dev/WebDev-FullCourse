'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  FileText,
  Zap,
  Shield,
  CheckCircle2,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="relative w-full overflow-hidden border-b bg-background pt-12 pb-16 lg:pt-24 lg:pb-32">
      {/* --- Background Effects --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 opacity-40 blur-[100px]"></div>
        <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 opacity-40 blur-[100px]"></div>

        {/* Floating Particles */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] left-[10%] text-primary/20">
          <FileText className="h-12 w-12" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[60%] left-[5%] text-blue-500/20">
          <Shield className="h-8 w-8" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[20%] right-[10%] text-yellow-500/20">
          <Zap className="h-10 w-10" />
        </motion.div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:items-center">
          {/* --- LEFT COLUMN: Text Content --- */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="mb-6">
              <div className="inline-flex items-center border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary/10 transition-colors cursor-default">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                100% Client-Side & Secure
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.5 }}>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-tight">
                Your PDFs, Processed <br />
                <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent animate-gradient bg-300%">
                  Entirely Offline
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.5 }}>
              <p className="mb-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
                Enjoy lightning-fast PDF tools without compromising privacy. Files NEVER leave your browser—processing happens instantly on your device.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="mb-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 px-8 text-base transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]"
                asChild>
                <Link href="/tools/merge-pdf">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base hover:bg-muted/60 hover:text-foreground!"
                asChild>
                <Link href="#tools-grid">View All Tools</Link>
              </Button>
            </motion.div>

            {/* Value Props (Replaces Social Proof) */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Instant Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                <span>No File Uploads</span>
              </div>
            </motion.div>
            
            {/* Social Proof / Trust (Commented Out) */}
            {/* <motion.div
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                    U{i}
                  </div>
                ))}
              </div>
              <p>Trusted by 10,000+ users</p>
            </motion.div> */}
          </motion.div>

          {/* --- RIGHT COLUMN: 3D Animated Mockup --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative mx-auto w-full max-w-[600px] lg:mr-0">
            {/* The Floating Container */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="relative z-10">
              {/* Main Glass Card */}
              <div className="relative overflow-hidden border border-white/20 bg-background/70 shadow-2xl backdrop-blur-xl ring-1 ring-black/5">
                {/* Fake Browser Header */}
                <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400/80"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400/80"></div>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 text-[10px] text-muted-foreground rounded-full border border-white/10">
                    <Shield className="h-3 w-3 text-green-500" />
                    local://pdf-processor/secure
                  </div>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground/50" />
                </div>

                {/* Dashboard Content Mockup */}
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Local PDF Desktop</h3>
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        System Ready • 100% Offline
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-dashed gap-2">
                       <Zap className="h-3 w-3" />
                       Turbo Mode
                    </Button>
                  </div>

                  {/* File List */}
                  <div className="space-y-3">
                    {/* File 1 - Processing */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                      className="flex items-center justify-between border bg-card p-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center bg-blue-500/10 text-blue-500">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Q3_Financials.pdf</p>
                          <p className="text-xs text-blue-500 font-medium flex items-center gap-1">
                            <Zap className="h-3 w-3 animate-pulse" />
                            Compressing locally...
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">45%</span>
                    </motion.div>

                    {/* File 2 - Done */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 }}
                      className="flex items-center justify-between border bg-muted/30 p-3 opacity-80">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center bg-green-500/10 text-green-500">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Contract_Signed.pdf</p>
                          <p className="text-xs text-muted-foreground">Merged • Ready for download</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-green-600">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating "Success" Card Notification (Parallax element) */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 1 }}
                className="absolute right-4 bottom-8 z-20 hidden border bg-background/90 backdrop-blur-md p-4 shadow-xl lg:block ring-1 ring-black/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Compression Complete</p>
                    <p className="text-xs text-muted-foreground">Saved 8.4MB (Local Only)</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Background Blob behind image */}
            <div className="absolute inset-0 -z-10 translate-x-10 translate-y-10 rounded-full bg-gradient-to-tr from-primary/20 to-blue-400/20 blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
