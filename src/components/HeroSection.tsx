import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHeart from './FloatingHeart';
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onEnter: () => void;
}

const HeroSection = ({ onEnter }: HeroSectionProps) => {
  const [dissolving, setDissolving] = useState(false);

  const handleEnter = () => {
    setDissolving(true);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <section className="scroll-section hero-section">
      {/* Vignette overlay */}
      <div className="vignette" />
      
      {/* 3D Heart */}
      <AnimatePresence>
        {!dissolving && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
          >
            <FloatingHeart dissolving={dissolving} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-cream mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            textShadow: '0 0 40px rgba(139, 21, 56, 0.5)',
          }}
        >
          A Love Letter
        </motion.h1>
        
        <motion.p
          className="font-body text-rose-soft text-lg md:text-xl mb-12 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          For someone truly special ❤️
        </motion.p>
        
        <div className="flex flex-col items-center gap-4">
          {/* Main Enter Button */}
          <motion.button
            className="btn-romantic"
            onClick={handleEnter}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-display text-xl tracking-wide">Enter in My Love</span>
          </motion.button>

          {/* NEW: Memories Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <Link to="/memories">
              <button className="px-6 py-2 text-rose-soft hover:text-white transition-colors duration-300 text-sm md:text-base tracking-widest uppercase border border-transparent hover:border-rose-soft/30 rounded-full">
                Or view our Memories 💞
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-rose-soft/50 flex justify-center pt-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-3 rounded-full bg-rose-soft/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;