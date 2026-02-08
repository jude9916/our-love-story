import { useRef } from 'react';
import Fireflies from '@/components/Fireflies';
import HeroSection from '@/components/HeroSection';
import LoveLetterSection from '@/components/LoveLetterSection';
import ProposalSection from '@/components/ProposalSection';
import HerEssenceSection from '@/components/HerEssenceSection';
import JourneySection from '@/components/JourneySection';

const Home = () => {
  const letterRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    letterRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // 👇 FIX: Removed "snap-y snap-mandatory h-screen". 
    // Now it is just a normal scrolling page.
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      
      {/* Global fireflies */}
      <Fireflies />
      
      {/* Hero with 3D Heart */}
      <HeroSection onEnter={handleEnter} />
      
      {/* Love Letter */}
      <div ref={letterRef}>
        <LoveLetterSection />
      </div>
      
      {/* Her Essence (The 3D Photo) */}
      <HerEssenceSection />

      {/* Our Story (The Timeline) */}
      {/* 👇 This ID makes the arrow button work */}
      <div id="journey-section">
        <JourneySection />
      </div>
      
      {/* Proposal */}
      <div id="proposal-section">
        <ProposalSection />
      </div>

    </main>
  );
};

export default Home;