import { useRef } from 'react';
import { Link } from 'react-router-dom'; // 👈 1. Import Link
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
      <div id="journey-section">
        <JourneySection />
      </div>
      
      {/* Proposal */}
      <div id="proposal-section">
        <ProposalSection />
      </div>

      {/* 👇 2. NEW BUTTON ADDED HERE */}
      {/* I wrapped it in a fixed div so it floats in the bottom-right corner */}
      <div className="fixed bottom-10 right-6 z-50">
        <Link 
          to="/valentine" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-full font-bold shadow-lg hover:bg-rose-600 hover:scale-105 transition-all animate-bounce"
        >
          💌 Open My Heart
        </Link>
      </div>

    </main>
  );
};

export default Home;