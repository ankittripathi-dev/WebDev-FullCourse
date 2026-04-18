import React from 'react';
import { ScrollText, CheckCircle, AlertCircle, HelpCircle, FileText } from 'lucide-react';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Review the Terms of Service for using Freedf\'s free online PDF tools. Understand your rights and responsibilities when using our platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="border-b bg-muted/30 py-12 md:py-20">
        <div className="container px-4 mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-primary/10 text-primary">
            <ScrollText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            Terms of Service
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Please read these terms carefully before using Freedf. By using our services, you agree to be bound by these terms.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Last Updated: January 1, 2026
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 mx-auto py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-12">
          
          {/* Section 1 */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              1. Acceptance of Terms
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Freedf website and tools ("Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              2. Description of Service
            </h3>
             <p className="text-muted-foreground leading-relaxed mb-4">
              Freedf provides online PDF manipulation tools (such as merging, splitting, compressing, and converting) that run entirely in your web browser. We do not store, host, or view your files on our servers.
            </p>
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <p className="text-sm text-foreground font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Service is provided free of charge for standard use.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              3. User Responsibilities
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You are solely responsible for the content of the files you process using our Service. You agree NOT to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Process any content that is illegal, harmful, threatening, or infringes on privacy rights.</li>
              <li>Infringe upon the intellectual property rights of others.</li>
              <li>Distribute malware, viruses, or harmful code.</li>
              <li>Attempt to reverse engineer or disrupt the Service's integrity.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              4. Disclaimer of Warranties
            </h3>
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-500/10 rounded-r-lg">
              <p className="text-muted-foreground italic">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Freedf makes no warranties, expressed or implied, regarding the reliability, accuracy, or availability of the Service. We do not guarantee that the Service will be uninterrupted or error-free.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              5. Limitation of Liability
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Freedf be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service, including but not limited to damages for loss of data, profits, or business interruption.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              6. Intellectual Property
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We do not claim ownership of the files you process. You retain all rights and ownership of your content. The design, code, and graphics of the Freedf website are owned by us and protected by copyright usage.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              7. Changes to Terms
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              8. Contact Us
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions regarding these Terms, please contact us at:
            </p>
             <Link href="/contact" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Contact Support
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}
