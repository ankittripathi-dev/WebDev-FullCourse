'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  FileText,
  Scissors,
  Zap,
  Wrench,
  LogIn,
  UserPlus,
  FileImage,
  FileType,
  Presentation,
  Table,
  Code,
  Image as ImageIcon,
  Lock,
  Unlock,
  RotateCw,
  Hash,
  Droplets,
  Crop,
  PenTool,
} from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

type MenuLinkItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
};

type MenuSection =
  | { key: string; label: string; type: 'link'; href: string }
  | {
    key: string;
    label: string;
    type: 'dropdown';
    sections?: { title: string; items: MenuLinkItem[] }[];
  };

const convertToPdfItems: MenuLinkItem[] = [
  {
    label: 'JPG to PDF',
    href: '/tools/jpg-to-pdf',
    icon: <FileImage className="h-4 w-4" />,
    badge: 'Popular',
  },
  // { label: 'WORD to PDF', href: '/tools/word-to-pdf', icon: <FileType className="h-4 w-4" /> },
  // {
  //   label: 'POWERPOINT to PDF',
  //   href: '/tools/powerpoint-to-pdf',
  //   icon: <Presentation className="h-4 w-4" />,
  // },
  // { label: 'EXCEL to PDF', href: '/tools/excel-to-pdf', icon: <Table className="h-4 w-4" /> },
  // { label: 'HTML to PDF', href: '/tools/html-to-pdf', icon: <Code className="h-4 w-4" /> },
];

const convertFromPdfItems: MenuLinkItem[] = [
  { label: 'PDF to JPG', href: '/tools/pdf-to-jpg', icon: <ImageIcon className="h-4 w-4" /> },
  // { label: 'PDF to WORD', href: '/tools/pdf-to-word', icon: <FileType className="h-4 w-4" /> },
  // {
  //   label: 'PDF to POWERPOINT',
  //   href: '/tools/pdf-to-powerpoint',
  //   icon: <Presentation className="h-4 w-4" />,
  // },
  // { label: 'PDF to EXCEL', href: '/tools/pdf-to-excel', icon: <Table className="h-4 w-4" /> },
  // { label: 'PDF to PDF/A', href: '/tools/pdf-to-pdfa', icon: <FileText className="h-4 w-4" /> },
];

const organizePdfItems: MenuLinkItem[] = [
  { label: 'Merge PDF', href: '/tools/merge-pdf', icon: <FileText className="h-4 w-4" /> },
  { label: 'Split PDF', href: '/tools/split-pdf', icon: <Scissors className="h-4 w-4" /> },
  { label: 'Remove Pages', href: '/tools/remove-pages', icon: <FileText className="h-4 w-4" /> },
  { label: 'Extract Pages', href: '/tools/extract-pages', icon: <FileText className="h-4 w-4" /> },
  { label: 'Organize PDF', href: '/tools/organize-pdf', icon: <FileText className="h-4 w-4" /> },
  // { label: 'Scan to PDF', href: '/tools/scan-to-pdf', icon: <FileText className="h-4 w-4" /> },
];

const optimizePdfItems: MenuLinkItem[] = [
  {
    label: 'Compress PDF',
    href: '/tools/compress-pdf',
    icon: <Zap className="h-4 w-4" />,
    badge: 'Popular',
  },
  { label: 'Repair PDF', href: '/tools/repair-pdf', icon: <Wrench className="h-4 w-4" /> },
  { label: 'OCR PDF', href: '/tools/ocr-pdf', icon: <FileText className="h-4 w-4" /> },
];

const editSecurityItems: MenuLinkItem[] = [
  { label: 'Rotate PDF', href: '/tools/rotate-pdf', icon: <RotateCw className="h-4 w-4" /> },
  {
    label: 'Add Page Numbers',
    href: '/tools/add-page-numbers',
    icon: <Hash className="h-4 w-4" />,
  },
  { label: 'Add Watermark', href: '/tools/add-watermark', icon: <Droplets className="h-4 w-4" /> },
  { label: 'Crop PDF', href: '/tools/crop-pdf', icon: <Crop className="h-4 w-4" /> },
  { label: 'Unlock PDF', href: '/tools/unlock-pdf', icon: <Unlock className="h-4 w-4" /> },
  { label: 'Protect PDF', href: '/tools/protect-pdf', icon: <Lock className="h-4 w-4" /> },
  // { label: 'Sign PDF', href: '/tools/sign-pdf', icon: <PenTool className="h-4 w-4" /> },
];

const menuConfig: MenuSection[] = [
  { key: 'merge', label: 'Merge PDF', type: 'link', href: '/tools/merge-pdf' },
  { key: 'split', label: 'Split PDF', type: 'link', href: '/tools/split-pdf' },
  { key: 'compress', label: 'Compress PDF', type: 'link', href: '/tools/compress-pdf' },
  {
    key: 'convert',
    label: 'Convert PDF',
    type: 'dropdown',
    sections: [
      { title: 'Convert PDF', items: [...convertToPdfItems, ...convertFromPdfItems] },
    ],
  },
  {
    key: 'all-tools',
    label: 'All PDF tools',
    type: 'dropdown',
    sections: [
      { title: 'ORGANIZE PDF', items: organizePdfItems },
      { title: 'OPTIMIZE PDF', items: optimizePdfItems },
      { title: 'CONVERT PDF', items: [...convertToPdfItems, ...convertFromPdfItems] },
      { title: 'EDIT & SECURITY', items: editSecurityItems },
    ],
  },
  { key: 'blog', label: 'Blog', type: 'link', href: '/blog' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Freedf"
            width={120}
            height={100}
            className="w-full object-contain"
            priority
          />
        </Link>

        <div className="hidden lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {menuConfig.map((section) => (
                <NavigationMenuItem
                  className=""
                  key={section.key}>
                  {section.type === 'link' ? (
                    <NavigationMenuLink
                      className="bg-white"
                      asChild>
                      <Link
                        href={section.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'text-foreground hover:text-white'
                        )}>
                        {section.label}
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="text-foreground transition-colors bg-white hover:text-white">
                        {section.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div
                          className={cn(
                            'p-4',
                            section.key === 'convert' && 'w-[300px] lg:w-[300px]',
                            section.key === 'all-tools' && 'w-[800px] lg:w-[850px]'
                          )}>
                          <div
                            className={cn(
                              'grid',
                              section.key === 'convert' && 'grid-cols-1 gap-6',
                              section.key === 'all-tools' && 'grid-cols-4 gap-3'
                            )}>
                            {section.sections?.map((subSection, idx) => (
                              <div
                                key={idx}
                                className="space-y-2">
                                <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide">
                                  {subSection.title}
                                </h4>
                                <ul className="flex flex-col gap-1.5">
                                  {subSection.items.map((item) => (
                                    <li key={item.label}>
                                      <NavigationMenuLink asChild>
                                        <Link
                                          href={item.href}
                                          className="group flex items-center flex-row gap-1.5 border border-border bg-background px-2 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary">
                                          <span className="text-muted-foreground group-hover:text-primary shrink-0">
                                            {item.icon}
                                          </span>
                                          <span className="flex-1 truncate">{item.label}</span>
                                          {item.badge && (
                                            <span className=" bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground shrink-0">
                                              {item.badge}
                                            </span>
                                          )}
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-3">
          {/* <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              asChild>
              <Link
                href="/login"
                className="text-foreground hover:bg-transparent hover:text-primary">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button
              variant="default"
              asChild>
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground hover:bg-primary/90">
                <UserPlus className="mr-2 h-4 w-4" />
                Signup
              </Link>
            </Button>
          </div> */}

          {/* Mobile */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] p-0 flex flex-col h-dvh bg-background border-l">
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="Freedf"
                      width={100}
                      height={32}
                      className="h-8 w-auto object-contain"
                    />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 w-full overflow-y-auto">
                  <nav className="flex flex-col px-4 py-6 gap-6 pb-24">
                    {/* Direct Links section */}
                    <div className="space-y-1">
                      {menuConfig
                        .filter((s) => s.type === 'link')
                        .map((link) => (
                          <Link
                            key={link.key}
                            href={(link as Extract<MenuSection, { type: 'link' }>).href}
                            className="flex items-center px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-primary/5 hover:text-primary">
                            {link.label}
                          </Link>
                        ))}
                    </div>

                    {/* Accordion Sections */}
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full space-y-2">
                      {menuConfig
                        .filter((s) => s.type === 'dropdown')
                        .map((section) => (
                          <AccordionItem
                            key={section.key}
                            value={section.key}
                            className="border px-2 data-[state=open]:bg-muted/30">
                            <AccordionTrigger className="px-2 py-3 text-sm font-medium text-foreground hover:no-underline hover:text-primary">
                              {section.label}
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                              <div className="space-y-6 px-2">
                                {section.sections?.map((subSection, idx) => (
                                  <div
                                    key={idx}
                                    className="space-y-3">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                                      {subSection.title}
                                    </h4>
                                    <ul className="grid gap-2">
                                      {subSection.items.map((item) => (
                                        <li key={item.label}>
                                          <Link
                                            href={item.href}
                                            className="group flex items-center gap-3 p-2 text-sm text-foreground transition-colors hover:bg-background hover:shadow-sm ring-1 ring-transparent hover:ring-border/50">
                                            <span className="flex h-8 w-8 items-center justify-center bg-primary/5 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                                              {item.icon}
                                            </span>
                                            <span className="flex-1 font-medium">{item.label}</span>
                                            {item.badge && (
                                              <span className="bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                {item.badge}
                                              </span>
                                            )}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
