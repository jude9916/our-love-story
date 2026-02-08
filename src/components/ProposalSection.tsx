import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Stars } from 'lucide-react';
import confetti from 'canvas-confetti'; 
import Ticket from './Ticket';

const ProposalSection = () => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    triggerHeartFireworks();
  };

  const triggerHeartFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    // 👇 DEFINE THE HEART SHAPE HERE
    const heart = confetti.shapeFromPath({
      path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 76,-75 38,0 57,18 75,56z'
    });

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        shapes: [heart], // 👈 USE THE HEART SHAPE
        colors: ['#FFC0CB', '#FF69B4', '#FF1493', '#C71585', '#fb7185', '#f43f5e'], // Pinks & Reds
        scalar: 2 // 👈 MAKE THEM BIGGER
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        shapes: [heart], // 👈 USE THE HEART SHAPE
        colors: ['#FFC0CB', '#FF69B4', '#FF1493', '#C71585', '#fb7185', '#f43f5e'], // Pinks & Reds
        scalar: 2 // 👈 MAKE THEM BIGGER
      });
    }, 250);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden py-20">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-black to-black" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        
        {/* Intro Icon */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
             <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-pulse" />
             <Stars className="absolute -top-4 -right-4 w-10 h-10 text-yellow-400 animate-bounce" />
          </div>
        </motion.div>

        {!accepted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-5xl md:text-7xl text-white mb-6">
              You already said <span className="text-rose-500">Yes</span>...
            </h2>
            <p className="font-body text-xl md:text-2xl text-rose-100/80 mb-12 leading-relaxed">
              And that was the best moment of my life. <br/>
              But today, I have one more question for my Sam:
            </p>

            <h3 className="font-display text-4xl md:text-6xl text-white mb-12 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
              Will you be my Valentine?
            </h3>

            {/* TWO YES BUTTONS */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <motion.button
                onClick={handleAccept}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-rose-600 text-white font-display text-xl rounded-full shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:bg-rose-50 transition-all"
              >
                Yes, Forever! ❤️
              </motion.button>

              <motion.button
                onClick={handleAccept}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-black font-display text-xl rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-rose-50 transition-all"
              >
                Of Course! 🌹
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* SUCCESS STATE WITH TICKET REVEAL */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="font-display text-4xl md:text-6xl text-white mb-4">
              You already are. This is just the ceremony💕
            </h2>
            <p className="font-body text-xl text-rose-200 mb-8">
              I can't wait to celebrate the life with you.
            </p>
            
            {/* THE GOLDEN TICKET */}
            <Ticket />

          </motion.div>
        )}

      </div>
    </section>
  );
};

export default ProposalSection;