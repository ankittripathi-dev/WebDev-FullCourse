'use client';

import Link from 'next/link';
import { FileText, Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background to-muted/20 p-4">
      <div className="mx-auto w-full max-w-2xl">
        {/* Animated 404 Number */}
        <div className="mb-8 text-center">
          <h1 className="text-9xl font-bold text-primary/20 sm:text-[12rem]">404</h1>
          <div className="relative -mt-24 sm:-mt-32">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 sm:h-40 sm:w-40">
              <FileText className="h-16 w-16 text-primary sm:h-20 sm:w-20" />
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold sm:text-4xl">Page Not Found</CardTitle>
            <CardDescription className="mt-2 text-base sm:text-lg">
              Oops! The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Popular Tools Quick Links */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Popular Tools:</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-start">
                  <Link href="/tools/merge-pdf">
                    <FileText className="mr-2 h-4 w-4" />
                    Merge PDF
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-start">
                  <Link href="/tools/split-pdf">
                    <FileText className="mr-2 h-4 w-4" />
                    Split PDF
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-start">
                  <Link href="/tools/compress-pdf">
                    <FileText className="mr-2 h-4 w-4" />
                    Compress PDF
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-start">
                  <Link href="/tools/jpg-to-pdf">
                    <FileText className="mr-2 h-4 w-4" />
                    JPG to PDF
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-start">
                  <Link href="/tools/pdf-to-jpg">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF to JPG
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-start">
                  <Link href="/tools/rotate-pdf">
                    <FileText className="mr-2 h-4 w-4" />
                    Rotate PDF
                  </Link>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Go to Homepage
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto">
                <Link href="/tools">
                  <Search className="mr-2 h-5 w-5" />
                  Browse All Tools
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          If you believe this is an error, please{' '}
          <Link
            href="/contact"
            className="text-primary hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
