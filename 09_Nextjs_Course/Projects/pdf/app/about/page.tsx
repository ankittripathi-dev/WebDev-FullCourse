import type { Metadata } from 'next';
import { AboutHero } from '@/components/atom/about/AboutHero';
import { TeamSection } from '@/components/atom/about/TeamSection';
import { MissionSection } from '@/components/atom/about/MissionSection';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Freedf, the team behind the free and secure PDF tools. We are dedicated to providing privacy-focused document processing solutions.',
};
import Footer from '@/components/shared/Footer';

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <TeamSection />
      <MissionSection />
      <Footer />
    </>
  );
}

