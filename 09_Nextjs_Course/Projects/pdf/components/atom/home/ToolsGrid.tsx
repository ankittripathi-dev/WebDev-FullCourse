'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Scissors,
  Trash2,
  FileInput,
  LayoutGrid,
  ScanLine,
  Minimize2,
  Wrench,
  Type,
  Image as ImageIcon,
  FileType,
  Presentation,
  Table,
  Code,
  RotateCw,
  Hash,
  Droplets,
  Crop,
  Lock,
  Unlock,
  PenTool,
  Eraser,
  GitCompare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// --- DATA CONFIGURATION ---
type ToolCategory =
  | 'Organize'
  | 'Optimize'
  | 'Convert PDF'
  | 'Edit'
  | 'Security';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  category: ToolCategory;
  badge?: string; // Optional "New" or "Popular" badge
}

const tools: Tool[] = [
  // Organize
  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one unified document.',
    icon: FileText,
    href: '/tools/merge-pdf',
    category: 'Organize',
    badge: 'Popular',
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract specific pages or split document into parts.',
    icon: Scissors,
    href: '/tools/split-pdf',
    category: 'Organize',
  },
  {
    id: 'remove',
    name: 'Remove Pages',
    description: 'Delete unwanted pages from your PDF file.',
    icon: Trash2,
    href: '/tools/remove-pages',
    category: 'Organize',
  },
  {
    id: 'extract',
    name: 'Extract Pages',
    description: 'Create a new PDF from selected pages.',
    icon: FileInput,
    href: '/tools/extract-pages',
    category: 'Organize',
  },
  {
    id: 'organize',
    name: 'Organize PDF',
    description: 'Sort, add, and rotate pages instantly.',
    icon: LayoutGrid,
    href: '/tools/organize-pdf',
    category: 'Organize',
  },
  // {
  //   id: 'scan',
  //   name: 'Scan to PDF',
  //   description: 'Capture documents using your camera.',
  //   icon: ScanLine,
  //   href: '/tools/scan-to-pdf',
  //   category: 'Organize',
  // },

  // Optimize
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce file size while maintaining quality.',
    icon: Minimize2,
    href: '/tools/compress-pdf',
    category: 'Optimize',
    badge: 'Popular',
  },
  {
    id: 'repair',
    name: 'Repair PDF',
    description: 'Fix damaged or corrupt PDF files.',
    icon: Wrench,
    href: '/tools/repair-pdf',
    category: 'Optimize',
  },
  {
    id: 'ocr',
    name: 'OCR PDF',
    description: 'Make scanned text selectable and searchable.',
    icon: Type,
    href: '/tools/ocr-pdf',
    category: 'Optimize',
    badge: 'New',
  },

  // Convert PDF
  {
    id: 'jpg-pdf',
    name: 'JPG to PDF',
    description: 'Convert images to PDF documents.',
    icon: ImageIcon,
    href: '/tools/jpg-to-pdf',
    category: 'Convert PDF',
  },
  // {
  //   id: 'word-pdf',
  //   name: 'WORD to PDF',
  //   description: 'Convert DOCX documents to PDF.',
  //   icon: FileType,
  //   href: '/tools/word-to-pdf',
  //   category: 'Convert to PDF',
  // },
  // {
  //   id: 'ppt-pdf',
  //   name: 'POWERPOINT to PDF',
  //   description: 'Convert presentations to PDF.',
  //   icon: Presentation,
  //   href: '/tools/powerpoint-to-pdf',
  //   category: 'Convert to PDF',
  // },
  // {
  //   id: 'excel-pdf',
  //   name: 'EXCEL to PDF',
  //   description: 'Convert spreadsheets to PDF.',
  //   icon: Table,
  //   href: '/tools/excel-to-pdf',
  //   category: 'Convert to PDF',
  // },
  // {
  //   id: 'html-pdf',
  //   name: 'HTML to PDF',
  //   description: 'Convert webpages to PDF documents.',
  //   icon: Code,
  //   href: '/tools/html-to-pdf',
  //   category: 'Convert to PDF',
  // },

  {
    id: 'pdf-jpg',
    name: 'PDF to JPG',
    description: 'Extract pages as high-quality images.',
    icon: ImageIcon,
    href: '/tools/pdf-to-jpg',
    category: 'Convert PDF',
  },
  // {
  //   id: 'pdf-word',
  //   name: 'PDF to WORD',
  //   description: 'Convert PDF to editable Word docs.',
  //   icon: FileType,
  //   href: '/tools/pdf-to-word',
  //   category: 'Convert from PDF',
  // },
  // {
  //   id: 'pdf-ppt',
  //   name: 'PDF to POWERPOINT',
  //   description: 'Convert PDF to editable slides.',
  //   icon: Presentation,
  //   href: '/tools/pdf-to-powerpoint',
  //   category: 'Convert from PDF',
  // },
  // {
  //   id: 'pdf-excel',
  //   name: 'PDF to EXCEL',
  //   description: 'Convert PDF tables to Excel sheets.',
  //   icon: Table,
  //   href: '/tools/pdf-to-excel',
  //   category: 'Convert from PDF',
  // },

  // Edit
  {
    id: 'rotate',
    name: 'Rotate PDF',
    description: 'Rotate pages 90, 180, or 270 degrees.',
    icon: RotateCw,
    href: '/tools/rotate-pdf',
    category: 'Edit',
  },
  {
    id: 'numbers',
    name: 'Add Page Numbers',
    description: 'Insert page numbers into your document.',
    icon: Hash,
    href: '/tools/add-page-numbers',
    category: 'Edit',
  },
  {
    id: 'watermark',
    name: 'Add Watermark',
    description: 'Overlay text or images on your PDF.',
    icon: Droplets,
    href: '/tools/add-watermark',
    category: 'Edit',
  },
  {
    id: 'crop',
    name: 'Crop PDF',
    description: 'Trim margins and adjust page size.',
    icon: Crop,
    href: '/tools/crop-pdf',
    category: 'Edit',
  },

  // Security
  {
    id: 'unlock',
    name: 'Unlock PDF',
    description: 'Remove password security from PDFs.',
    icon: Unlock,
    href: '/tools/unlock-pdf',
    category: 'Security',
  },
  {
    id: 'protect',
    name: 'Protect PDF',
    description: 'Encrypt your PDF with a password.',
    icon: Lock,
    href: '/tools/protect-pdf',
    category: 'Security',
  },
  // {
  //   id: 'sign',
  //   name: 'Sign PDF',
  //   description: 'Add your digital signature to documents.',
  //   icon: PenTool,
  //   href: '/tools/sign-pdf',
  //   category: 'Security',
  // },
  {
    id: 'redact',
    name: 'Redact PDF',
    description: 'Permanently hide sensitive information.',
    icon: Eraser,
    href: '/tools/redact-pdf',
    category: 'Security',
  },
  {
    id: 'compare',
    name: 'Compare PDF',
    description: 'Find differences between two files.',
    icon: GitCompare,
    href: '/tools/compare-pdf',
    category: 'Security',
  },
];

const categories = [
  'All Tools',
  'Organize',
  'Optimize',
  'Convert PDF',
  'Edit',
  'Security',
];

export function ToolsGrid() {
  const [activeCategory, setActiveCategory] = useState('All Tools');

  // Filter tools based on active tab
  const filteredTools =
    activeCategory === 'All Tools'
      ? tools
      : tools.filter((tool) => tool.category === activeCategory);

  return (
    <section
      id="tools-grid"
      className="border-t bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* --- Header & Tabs --- */}
        <div className="mb-16 flex flex-col items-center space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <span className="bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Explore Our Tools
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              We have everything you need to handle your PDF tasks.
            </p>
          </div>

          {/* Modern Tabs - Flat Design */}
          <ScrollArea className="w-full pb-4 sm:pb-0">
            <div className="mx-auto flex w-max gap-1 border-b border-border">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'relative px-6 py-3 text-sm font-medium transition-colors',
                    activeCategory === category
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}>
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* --- The Grid - Modern Flat Cards --- */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}>
                <Link
                  href={tool.href}
                  className="group relative flex h-full flex-col border border-border bg-background p-6 transition-all duration-200 hover:border-primary hover:bg-primary/5">
                  <div className="mb-4 flex items-start justify-between">
                    {/* Icon Container - Modern with subtle background */}
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center transition-all duration-200',
                        'text-muted-foreground bg-muted/50',
                        'group-hover:text-primary group-hover:bg-primary/10'
                      )}>
                      <tool.icon className="h-5 w-5" />
                    </div>

                    {/* Badge */}
                    {tool.badge && (
                      <Badge
                        variant="secondary"
                        className="bg-accent text-accent-foreground border-0">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
