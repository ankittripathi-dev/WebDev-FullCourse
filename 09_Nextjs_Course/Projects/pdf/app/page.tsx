import { Metadata } from 'next';
import { HeroSection } from '@/components/atom/home/Hero';
import { FeaturesSection } from '@/components/atom/home/FeaturesSection';
import { TestimonialsSection } from '@/components/atom/home/TestimonialsSection';
import { FAQSection } from '@/components/atom/home/FAQSection';
import { CTASection } from '@/components/atom/home/CTASection';
import { ToolsGrid } from '@/components/atom/home/ToolsGrid';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Freedf - Free Online PDF Tools',
  description:
    'Freedf is your one-stop solution for all PDF needs. Merge, split, compress, and convert PDFs entirely in your browser with 100% privacy and security.',
};

const page = () => {
  return (
    <>
      <HeroSection />
      <ToolsGrid />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default page;
