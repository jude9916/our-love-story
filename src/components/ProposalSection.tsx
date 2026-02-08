import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Calendar, MapPin, Clock, IndianRupee, ReceiptText, ShieldBan } from 'lucide-react';

const ProposalSection = () => {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [showTicket, setShowTicket] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNoHover = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const maxX = container.width / 2 - 80;
    const maxY = container.height / 3;
    
    // More dramatic dodges as count increases
    const intensity = Math.min(1 + dodgeCount * 0.2, 2);
    
    const newX = (Math.random() - 0.5) * maxX * 2 * intensity;
    const newY = (Math.random() - 0.5) * maxY * 2 * intensity;
    
    setNoButtonPos({ x: newX, y: newY });
    setDodgeCount(prev => prev + 1);
  };

  const handleYesClick = () => {
    setCelebration(true);
    
    // Fire confetti!
    const duration = 4000;
    const end = Date.now() + duration;
    
    const colors = ['#FFB4C2', '#D4AF37', '#FF69B4', '#FFD700', '#FF1493'];
    
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.8 },
        colors,
        shapes: ['circle'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.8 },
        colors,
        shapes: ['circle'],
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
    
    // Heart-shaped confetti burst
    // 1. Define the heart shape using an SVG path
const heart = confetti.shapeFromPath({
  path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 76,-75 38,0 57,18 75,56z'
});

// 2. Trigger the burst
setTimeout(() => {
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors: colors, // Assuming you have your colors array defined
    shapes: [heart], // <--- Use the custom heart shape here
    scalar: 2, // Increased scalar slightly so the hearts are visible
    drift: 0,
    ticks: 200 // Makes them float a bit longer
  });
}, 5000);
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors,
        shapes: [heart],
        scalar: 1.5,
      });
    }, 5000);
    
    
    // Show ticket after confetti starts
    setTimeout(() => {
      setShowTicket(true);
    }, 2000);
  };

  return (
    <section 
      ref={containerRef}
      className="scroll-section relative overflow-hidden"
      style={{
        background: celebration 
          ? 'radial-gradient(ellipse at center, hsl(43 74% 20%) 0%, hsl(0 100% 8%) 100%)'
          : 'radial-gradient(ellipse at center, hsl(0 100% 12%) 0%, hsl(0 100% 4%) 100%)',
        transition: 'background 1s ease-out',
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cream mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            textShadow: '0 0 60px rgba(212, 175, 55, 0.3)',
          }}
        >
          Will you be my Valentine?
        </motion.h2>
        
        {!celebration && (
          <div className="flex flex-col sm:flex-row items-center gap-8 relative">
            {/* Yes Button */}
            <motion.button
              className="btn-yes font-display"
              onClick={handleYesClick}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Yes! ❤️
            </motion.button>
            
            {/* No Button - Dodges on hover */}
            <motion.button
              ref={noButtonRef}
              className="btn-no font-body"
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              animate={{
                x: noButtonPos.x,
                y: noButtonPos.y,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              No
            </motion.button>
          </div>
        )}
        
        {celebration && !showTicket && (
          <motion.div
            className=" text-cream text-lg md:text-xl mb-12 max-w-md font-display font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          >
            You already are. This is just the ceremony💕
          </motion.div>
        )}
      </div>
      
      {/* Ticket Modal */}
      <AnimatePresence>
        {showTicket && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="ticket-card max-w-md w-full rounded-lg p-8 md:p-10"
              initial={{ scale: 0.5, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              {/* Ticket header */}
              <div className="text-center mb-8">
                <p className="text-rose-soft text-sm uppercase tracking-widest mb-2">
                  Admit One - VIP Access to My Life
                </p>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-burgundy-deep">
                  Date Night Ticket
                </h3>
              </div>
              
              {/* Dotted line */}
              <div className="border-t-2 border-dashed border-burgundy-deep/20 my-6" />
              
              {/* Ticket details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-sm text-burgundy-deep/60">Date</p>
                    <p className="font-display text-lg text-burgundy-deep">
                      Started Since I Met You My Love 🌍♥️🫵🏻
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-sm text-burgundy-deep/60">Time</p>
                    <p className="font-display text-lg text-burgundy-deep">
                      Always in my thoughts 😍
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldBan className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-sm text-burgundy-deep/60">Expiration</p>
                    <p className="font-display text-lg text-burgundy-deep">
                      Never 🌕✨
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IndianRupee className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-sm text-burgundy-deep/60">Price</p>
                    <p className="font-display text-lg text-burgundy-deep">
                      One Smile 🫠🤌🏻💗
                    </p>
                  </div>
                </div>

                 <div className="flex items-center gap-3">
                  <ReceiptText className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-sm text-burgundy-deep/60">T&C</p>
                    <p className="font-display text-lg text-burgundy-deep">
                      Non-refundable and strictly non-transferable 𓆩❤︎𓆪
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-sm text-burgundy-deep/60">Location</p>
                    <p className="font-display text-lg text-burgundy-deep">
                     Wherever we both meet 🫶🏼🧿💕
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Dotted line */}
              <div className="border-t-2 border-dashed border-burgundy-deep/20 my-6" />
              
              {/* Romantic tagline */}
              <div className="text-center">
                <p className="font-display italic text-burgundy-deep/80 text-lg">
                  "Every love story is beautiful, but ours is my favorite"
                </p>
                <Heart className="w-8 h-8 text-rose-soft mx-auto mt-4 animate-pulse" />
              </div>
              
              {/* Close button */}
              <motion.button
                className="mt-8 w-full py-3 rounded-full font-display text-lg"
                style={{
                  background: 'linear-gradient(135deg, hsl(350 80% 25%) 0%, hsl(0 100% 15%) 100%)',
                  color: 'hsl(30 50% 96%)',
                }}
                onClick={() => setShowTicket(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                I Can't Wait! 💕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProposalSection;
