'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  User,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden border-b bg-background pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 opacity-40 blur-[100px] animate-pulse"></div>
          <div
            className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 opacity-40 blur-[100px] animate-pulse"
            style={{ animationDelay: '2s' }}></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-2">
              <Sparkles className="h-3 w-3 mr-2" />
              We're here to help
            </motion.div>
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-tight">
                Get in Touch with
                <br />
                <span className="bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Our Team
                </span>
              </h1>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Have a question, feedback, or need support? We're always ready to listen. Drop us a
                message and we'll get back to you as soon as possible.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-muted/30">
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
            {/* Left Column: Contact Info Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="space-y-6">
              {/* Email Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Email Support</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  For general inquiries and support requests.
                </p>
                <a
                  href="mailto:reetishtripathi@gmail.com"
                  className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                  reetishtripathi@gmail.com
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>

              {/* Response Time Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Quick Response</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </motion.div>

               {/* FAQs Card */}
               <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-purple-500/50 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 transition-colors group-hover:bg-purple-500 group-hover:text-white">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                   Check our FAQ section for quick answers to common questions.
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2">
              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-xl relative overflow-hidden">
                {/* Decorative gradients for the card */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <CardContent className="p-8 lg:p-10 relative z-10">
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border-4 border-green-500/20 shadow-lg shadow-green-500/10">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                      </div>
                      <h3 className="mb-3 text-3xl font-bold text-foreground">Message Sent!</h3>
                      <p className="mb-8 max-w-md text-muted-foreground text-lg">
                        Thank you for reaching out. We've received your message and will get back to you shortly.
                      </p>
                      <Button
                        onClick={() => setIsSuccess(false)}
                        variant="outline"
                        size="lg"
                        className="min-w-[200px] border-primary/20 hover:border-primary/50 text-primary">
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form
                    noValidate
                      onSubmit={handleSubmit}
                      className="space-y-8">
                      <div className="space-y-2 text-center sm:text-left">
                        <h2 className="text-2xl font-bold">Send us a Message</h2>
                        <p className="text-muted-foreground">
                          Fill out the form below and we'll get back to you as soon as possible.
                        </p>
                      </div>

                      {error && (
                        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                          {error}
                        </div>
                      )}

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Name Field */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-sm font-semibold">
                            Full Name
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Name"
                              value={formData.name}
                              onChange={handleChange}
                              className="pl-10 h-12 border-border/50 bg-background/50 transition-all focus:border-primary focus:ring-primary/10"
                              required
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-semibold">
                            Email Address
                          </Label>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-10 h-12 border-border/50 bg-background/50 transition-all focus:border-primary focus:ring-primary/10"
                              required
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subject Field */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="subject"
                          className="text-sm font-semibold">
                          Subject
                        </Label>
                        <div className="relative group">
                          <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="What can we help you with?"
                            value={formData.subject}
                            onChange={handleChange}
                            className="pl-10 h-12 border-border/50 bg-background/50 transition-all focus:border-primary focus:ring-primary/10"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Message Field */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="message"
                          className="text-sm font-semibold">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us clear details about your request..."
                          value={formData.message}
                          onChange={handleChange}
                          className="min-h-[150px] resize-none border-border/50 bg-background/50 transition-all focus:border-primary focus:ring-primary/10 p-4"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-primary/30"
                        disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
