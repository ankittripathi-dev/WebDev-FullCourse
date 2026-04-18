import React from 'react';
import { Shield, Lock, FileText, Server, Eye, Database } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read our Privacy Policy to understand how Freedf handles your data. We prioritize local processing and ensure your files never leave your device.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="border-b bg-muted/30 py-12 md:py-20">
        <div className="container px-4 mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-primary/10 text-primary">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            Privacy Policy
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Your privacy is our top priority. We built Freedf with a privacy-first architecture that ensures your files never leave your device.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Last Updated: January 1, 2026
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 mx-auto py-12 max-w-4xl">
        <div className="grid gap-12">
          
          {/* Core Promise Card */}
          <div className="p-6 md:p-8 rounded-2xl border bg-card text-card-foreground shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" />
              Our Core Privacy Promise
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">
                Unlike other online PDF tools, <strong>Freedf does not upload your files to any server</strong>. 
                All processing happens locally in your web browser using advanced WebAssembly technologies.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                <li className="flex items-start gap-2 text-muted-foreground">
                  <div className="mt-1 bg-green-500/10 text-green-600 rounded-full p-1">
                    <Server className="w-3 h-3" />
                  </div>
                  <span>No file uploads to servers</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <div className="mt-1 bg-green-500/10 text-green-600 rounded-full p-1">
                    <Database className="w-3 h-3" />
                  </div>
                  <span>No data retention</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <div className="mt-1 bg-green-500/10 text-green-600 rounded-full p-1">
                    <Eye className="w-3 h-3" />
                  </div>
                  <span>No prying eyes on your docs</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <div className="mt-1 bg-green-500/10 text-green-600 rounded-full p-1">
                    <Shield className="w-3 h-3" />
                  </div>
                  <span>100% Client-side processing</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-12">
            {/* Section 1 */}
            <section>
              <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                1. How We Process Your Files
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you use our tools (Merge, Split, Compress, etc.), your files are read by your web browser and processed using JavaScript libraries running on your own device. The "upload" process you see is simply your browser reading the file into its memory—it is not being sent over the internet to us or anyone else.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                2. Data Collection
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect minimal anonymous usage data to help us improve the application performance. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Browser type and version (to ensure compatibility)</li>
                <li>Device type (Desktop, Tablet, Mobile)</li>
                <li>Errors or bugs encountered (to fix issues)</li>
                <li>Anonymous page view statistics</li>
              </ul>
              <p className="mt-4 text-muted-foreground font-medium">
                We NEVER collect: Your files, file names, file contents, or personally identifiable information.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                3. Cookies & Local Storage
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use local storage technology to save your preferences (like Dark Mode settings). This data stays on your device and is not shared with us. We may use third-party analytics cookies (like Google Analytics) to understand how users navigate our site, but this data is aggregated and anonymous.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                4. Third-Party Services
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your information to outside parties. 
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                5. Contact Us
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-muted/30 p-4 rounded-lg inline-block">
                <p className="text-foreground font-medium">reetishtripathi@gmail.com</p>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
