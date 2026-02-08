import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Heart, Star, ChevronDown, Quote } from 'lucide-react';

const CARDS = [
  {
    title: "Divine Beauty",
    text: "It’s not just your smile, Sam... it's the light you bring into my dark world. You are the most beautiful sight my eyes have ever seen.",
    icon: Sparkles,
    color: "text-yellow-400"
  },
  {
    title: "Purest Soul",
    text: "Your heart is my favorite place. Your kindness, your patience... you make me want to be the man you deserve.",
    icon: Star,
    color: "text-rose-400"
  },
  {
    title: "My Everything",
    text: "Without you, the music stops. You are my anchor, my muse, and my greatest adventure. Sampritha, you are my life.",
    icon: Heart,
    color: "text-red-500"
  }
];

const HerEssenceSection = () => {
  const [index, setIndex] = useState(0);
  
  // --- 3D PARALLAX LOGIC ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    // We only calculate tilt if it's NOT a scroll event
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const width = rect.width;
    const height = rect.height;

    const xPct = (clientX - rect.left) / width - 0.5;
    const yPct = (clientY - rect.top) / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % CARDS.length);
  };

  return (
    <section 
      // 👇 FIX 1: Removed 'touch-none', added 'touch-action: pan-y' to allow vertical scrolling
      className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden snap-center"
      style={{ touchAction: 'pan-y' }} 
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={nextSlide}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-950/40 via-black to-black" />
      
      {/* 3D TILT CONTAINER */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-[85vw] md:w-[400px] aspect-[3/4] rounded-3xl cursor-pointer perspective-1000"
      >
        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(225,29,72,0.5)] border border-white/20 bg-black">
          
          <img 
            src="/radhe.jpg" 
            alt="My Love" 
            className="w-full h-full object-cover scale-110" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          <motion.div 
            style={{ 
              background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.2), transparent 80%)` 
            }}
            className="absolute inset-0 z-20 mix-blend-overlay pointer-events-none"
          />

          <div className="absolute bottom-0 left-0 w-full p-8 z-30 transform translate-z-20">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
               {(() => {
                const Icon = CARDS[index].icon;
                return (
                  <>
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${CARDS[index].color} drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
                    <h3 className="text-3xl font-display text-white mb-2 drop-shadow-md">
                      {CARDS[index].title}
                    </h3>
                    <p className="text-rose-100/90 font-body text-lg leading-snug">
                      "{CARDS[index].text}"
                    </p>
                  </>
                );
              })()}
            </motion.div>
            
            <p className="text-white/30 text-xs mt-6 uppercase tracking-widest animate-pulse">
              ( Tap card for more )
            </p>
            
            <div className="flex justify-center gap-1 mt-2">
              {CARDS.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-rose-500" : "w-2 bg-white/20"}`} />
              ))}
            </div>
          </div>

        </div>
      </motion.div>
      
      {/* 👇 FIX 2: Explicit "Scroll Down" Arrow Button */}
      <a 
  href="#journey-section" 
  className="absolute bottom-8 z-50 animate-bounce p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
  onClick={(e) => {
     e.preventDefault();
     document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' });
  }}
>
  <ChevronDown className="w-6 h-6 text-white" />
</a>

    </section>
  );
};

export default HerEssenceSection;