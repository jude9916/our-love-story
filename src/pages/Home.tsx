import { useRef } from 'react';
import Fireflies from '@/components/Fireflies';
import HeroSection from '@/components/HeroSection';
import LoveLetterSection from '@/components/LoveLetterSection';
import ProposalSection from '@/components/ProposalSection';

const Index = () => {
  const letterRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    letterRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="relative">
      {/* Global fireflies */}
      <Fireflies />
      
      {/* Hero with 3D Heart */}
      <HeroSection onEnter={handleEnter} />
      
      {/* Love Letter */}
      <div ref={letterRef}>
        <LoveLetterSection />
      </div>
      
      {/* Proposal */}
      <ProposalSection />
    </main>
  );
};

export default Index;
