'use client';
 
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-white p-4 font-sans text-slate-900">
        <div className="w-full max-w-md rounded-xl border border-red-100 bg-white p-8 shadow-xl text-center">
             <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
               <AlertTriangle className="h-8 w-8 text-red-500" />
             </div>
             <h2 className="mb-2 text-2xl font-bold tracking-tight">System Error</h2>
             <p className="mb-6 text-slate-500">
               A critical error prevented the application from loading.
             </p>
             <Button 
               onClick={() => reset()}
               className="w-full bg-slate-900 text-white hover:bg-slate-800"
             >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reload Application
             </Button>
        </div>
      </body>
    </html>
  );
}
