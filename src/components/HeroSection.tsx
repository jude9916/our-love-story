import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHeart from './FloatingHeart';
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onEnter: () => void;
}

const HeroSection = ({ onEnter }: HeroSectionProps) => {
  const [dissolving, setDissolving] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // --- YOUR TEXT ---
  const paragraph = "Before you, I was just stumbling through the dark. But now, everywhere you touch, my life glows. You are the clarity in my chaos and the warmth in my cold. I don't need to look for the light anymore, because I'm looking at you.";
  
  const words = paragraph.split(" ");

  // Initialize and check mobile
  useEffect(() => {
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- AUTO-WANDER ANIMATION ---
  const animationRef = useRef<number>();
  useEffect(() => {
    if (userHasInteracted) return;
    let time = 0;
    const animate = () => {
      time += 0.01;
      const x = (window.innerWidth / 2) + (Math.cos(time) * window.innerWidth * 0.3);
      const y = (window.innerHeight / 2) + (Math.sin(time * 2) * window.innerHeight * 0.2);
      setMousePos({ x, y });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [userHasInteracted]);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!userHasInteracted) setUserHasInteracted(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      setMousePos({ x: clientX - rect.left, y: clientY - rect.top });
    }
  };

  const handleEnter = () => {
    setDissolving(true);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  // 👇 FIXED: Increased mobile radius to 160 (Double the previous size)
  const spotlightRadius = isMobile ? 160 : 300;

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      className="scroll-section hero-section relative h-screen w-full overflow-hidden bg-black cursor-none touch-none"
    >
      
      {/* --- LAYER 1: CONTENT --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
         
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
         <div className="absolute inset-0 opacity-40 scale-110">
            <FloatingHeart dissolving={dissolving} />
         </div>

         <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mix-blend-screen">
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="font-display text-5xl md:text-8xl lg:text-9xl font-bold text-white mb-8 md:mb-16 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
               My Forever
            </motion.h1>
            
            {/* TEXT CONTAINER */}
            <div className="flex flex-wrap justify-center leading-loose md:leading-relaxed px-2 md:px-0">
              {words.map((word, i) => (
                <MagneticWord 
                  key={i} 
                  text={word} 
                  mouseX={mousePos.x} 
                  mouseY={mousePos.y} 
                  index={i}
                  isMobile={isMobile}
                />
              ))}
            </div>

         </div>

         {/* BUTTONS */}
         <div className="pointer-events-auto mt-12 md:mt-20 relative z-50 flex flex-col items-center gap-6">
            <motion.button
              onClick={handleEnter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 md:px-12 md:py-4 bg-white text-black font-display text-xs md:text-lg tracking-[0.2em] uppercase rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-rose-50 transition-all"
            >
              Step Into Our World
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
            >
              <Link to="/memories">
                <button className="px-6 py-2 text-rose-200 hover:text-white transition-colors duration-300 text-[10px] md:text-sm tracking-widest uppercase border-b border-transparent hover:border-white">
                  Or view our Memories 💞
                </button>
              </Link>
            </motion.div>
         </div>
      </div>

      {/* --- LAYER 2: DARKNESS MASK --- */}
      <motion.div 
        className="absolute inset-0 z-30 bg-black pointer-events-none transition-opacity duration-1000"
        animate={{ opacity: dissolving ? 0 : 1 }}
        style={{
            background: `radial-gradient(circle ${spotlightRadius}px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
        }}
      />

      {/* --- LAYER 3: GLOW ORB --- */}
      {!dissolving && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-20 mix-blend-screen"
            animate={{ x: mousePos.x - spotlightRadius, y: mousePos.y - spotlightRadius }}
            transition={{ type: "tween", ease: "linear", duration: 0 }}
            style={{ width: spotlightRadius * 2, height: spotlightRadius * 2 }}
          >
             <div className="w-full h-full bg-rose-500/20 rounded-full blur-[40px] md:blur-[80px]" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full blur-md" />
          </motion.div>
      )}

      {/* --- LAYER 4: HINT --- */}
      <AnimatePresence>
        {!userHasInteracted && !dissolving && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute bottom-20 w-full text-center z-50 pointer-events-none"
           >
             <p className="text-white/30 text-[10px] md:text-xs uppercase tracking-[0.4em] animate-pulse">
               Touch screen to find me
             </p>
           </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

// --- PHYSICS WORD COMPONENT ---
const MagneticWord = ({ text, mouseX, mouseY, index, isMobile }: { text: string, mouseX: number, mouseY: number, index: number, isMobile: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  
  let distance = 1000;
  let dx = 0;
  let dy = 0;

  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    dx = mouseX - wordX;
    dy = mouseY - wordY;
    distance = Math.sqrt(dx * dx + dy * dy);
  }

  // 👇 FIXED: Matched range to new radius (160px) so words react appropriately
  const range = isMobile ? 160 : 250; 
  const isClose = distance < range; 
  
  const x = isClose ? dx * 0.1 : 0;
  const y = isClose ? dy * 0.1 : 0;
  const scale = isClose ? 1.1 : 1; 
  const color = isClose ? "#ffffff" : "#f43f5e"; 
  const opacity = isClose ? 1 : 0.2; 
  const blur = isClose ? "0px" : "5px"; 

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity, 
        scale, 
        x, 
        y, 
        color,
        filter: `blur(${blur})`,
        textShadow: isClose ? "0 0 15px rgba(255,255,255,0.6)" : "none"
      }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="inline-block font-display text-sm md:text-3xl cursor-default tracking-widest mr-3 mb-3 md:mr-4 md:mb-4"
      style={{ willChange: "transform, opacity, filter" }}
    >
      {text}
    </motion.span>
  );
};

export default HeroSection;