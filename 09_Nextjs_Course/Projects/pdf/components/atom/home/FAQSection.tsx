'use client';

import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Is this service completely free?',
    answer:
      'Yes! All our essential PDF tools are completely free to use. There are no hidden fees, no subscriptions, and no credit card required. You can process as many files as you need without any limitations.',
  },
  {
    question: 'Is my data secure and private?',
    answer:
      'Absolutely! All processing happens directly in your browser. Your files never leave your device, and we never see, store, or have access to your documents. Your privacy is our top priority.',
  },
  {
    question: 'What file size limits do you have?',
    answer:
      "We have no file size restrictions! You can process PDFs of any size. Since everything runs in your browser, the only limit is your device's memory and processing power.",
  },
  {
    question: 'Do I need to create an account?',
    answer:
      "No account required! You can use all our tools immediately without any registration. Just upload your files and start processing - it's that simple.",
  },
  {
    question: 'What file formats are supported?',
    answer:
      "We support PDF files for all our tools. For conversion tools, we support various formats including JPG, PNG, Word, Excel, PowerPoint, and more. Check each tool's page for specific format support.",
  },
  {
    question: 'Can I use this on mobile devices?',
    answer:
      'Yes! Our tools work seamlessly on desktop, tablet, and mobile browsers. The interface is fully responsive and optimized for touch interactions.',
  },
  // {
  //   question: 'How fast is the processing?',
  //   answer:
  //     "Processing is instant! Since everything happens in your browser, there's no upload time or server processing delays. Results appear within seconds, depending on your file size and device performance.",
  // },
  {
    question: 'What happens if my PDF is password-protected?',
    answer:
      "If your PDF is encrypted, we'll prompt you to enter the password. The password is only used to unlock the file locally in your browser - we never see or store it.",
  },
];

export function FAQSection() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] bg-primary/8 rounded-full blur-[120px] animate-pulse"></div>
        <div
          className="absolute left-1/4 bottom-1/3 h-[500px] w-[500px] bg-blue-500/8 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '1.5s' }}></div>

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
          <div className="inline-flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              <span className="bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Got questions? We've got answers. Find everything you need to know about our PDF tools.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.4 }}>
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-border bg-card/50 px-6 py-2 transition-all duration-300 hover:bg-card hover:border-primary/30 hover:shadow-md">
                  <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
