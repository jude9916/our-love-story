import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Volume2, VolumeX } from 'lucide-react';

const LOVE_LETTER = `My Dearest Sam,

From the moment our paths crossed, my world has been painted in colors I never knew existed. Every smile you share, every laugh that escapes your lips, becomes a treasure I hold close to my heart.

You are my first thought when I wake and my last before I sleep. In your eyes, I've found my home. In your arms, I've found my peace.

This Valentine's Day, I wanted you to know that my love for you grows stronger with each passing moment. You are not just my love — you are my everything.

Lots of love

Forever and always yours,
With all my heart ❤️`;

const LoveLetterSection = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5]);

  // Check when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          setIsTyping(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < LOVE_LETTER.length) {
        setDisplayedText(LOVE_LETTER.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [isTyping]);

  const toggleAudio = () => {
    if (!audioRef.current) {
      // Create audio element - replace with your own audio file
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      // audioRef.current.src = '/path-to-your-romantic-audio.mp3';
    }

    if (isMuted) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  return (
    <section ref={sectionRef} className="scroll-section relative py-20">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(0 100% 10%) 0%, hsl(0 100% 4%) 100%)',
        }}
      />
      
      {/* Audio toggle */}
      <motion.button
        className="fixed top-6 right-6 z-50 p-3 glass-card rounded-full"
        onClick={toggleAudio}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-rose-soft" />
        ) : (
          <Volume2 className="w-5 h-5 text-gold" />
        )}
      </motion.button>
      
      {/* Paper card with parallax */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="paper-card max-w-xl w-full rounded-lg p-8 md:p-12"
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1000,
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative corner hearts */}
          <Heart className="absolute top-4 left-4 w-6 h-6 text-rose-soft/30" />
          <Heart className="absolute top-4 right-4 w-6 h-6 text-rose-soft/30" />
          <Heart className="absolute bottom-4 left-4 w-6 h-6 text-rose-soft/30" />
          <Heart className="absolute bottom-4 right-4 w-6 h-6 text-rose-soft/30" />
          
          {/* Letter content */}
          <div className="font-body text-burgundy-deep/90 text-base md:text-lg leading-relaxed whitespace-pre-line min-h-[400px]">
            {displayedText}
            {isTyping && <span className="typewriter-cursor" />}
          </div>
        </motion.div>
      </div>
      
      {/* Continue scrolling hint */}
      {!isTyping && displayedText.length > 0 && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-rose-soft/60 font-body text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            Continue scrolling ↓
          </motion.span>
        </motion.div>
      )}
    </section>
  );
};

export default LoveLetterSection;
