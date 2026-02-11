import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Valentine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  const messages = [
    "In a universe of billions...",
    "My soul recognized yours.",
    "The world is full of noise...",
    "But you are my quiet melody.",
    "Every beat echoes your name.",
    "I love you, Sam." 
  ];

  useEffect(() => {
    // 1. Load "Cormorant Garamond" (The Premium Movie Font)
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % messages.length);
    }, 4500); 
    return () => clearInterval(timer);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio error:", e));
        audioRef.current.volume = 0.5;
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  // --- CANVAS ANIMATION (Standard Zip Logic) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const rand = Math.random;

    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    const heartPosition = (rad: number) => [
      Math.pow(Math.sin(rad), 3),
      -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
    ];

    const scaleAndTranslate = (pos: number[], sx: number, sy: number, dx: number, dy: number) => [dx + pos[0] * sx, dy + pos[1] * sy];

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, width, height);
    };
    window.addEventListener('resize', onResize);

    let pointsOrigin: number[][] = [];
    let e: any[] = [];
    const traceCount = 50; 
    const dr = 0.1;
    const isMobile = width < 600;
    const scaleMod = isMobile ? 0.6 : 1.0; 

    const s1 = 210 * scaleMod; const r1 = 13 * scaleMod;
    const s2 = 150 * scaleMod; const r2 = 9 * scaleMod;
    const s3 = 90 * scaleMod;  const r3 = 5 * scaleMod;

    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), s1, r1, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), s2, r2, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), s3, r3, 0, 0));
    
    const heartPointsCount = pointsOrigin.length;
    const targetPoints: number[][] = [];

    for (let i = 0; i < heartPointsCount; i++) {
      const x = rand() * width;
      const y = rand() * height;
      e[i] = {
        vx: 0, vy: 0, R: 2, speed: rand() + 5,
        q: ~~(rand() * heartPointsCount), D: 2 * (i % 2) - 1,
        force: 0.2 * rand() + 0.7,
        f: "hsla(0," + ~~(40 * rand() + 100) + "%," + ~~(60 * rand() + 20) + "%,.3)",
        trace: Array(traceCount).fill({x, y})
      };
    }

    const config = { traceK: 0.4, timeDelta: 0.01 };
    let time = 0;
    let animationFrameId: number;

    const pulse = (kx: number, ky: number) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
      }
    };

    const loop = () => {
      const n = -Math.cos(time);
      pulse((1 + n) * .5, (1 + n) * .5);
      time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
      
      ctx.fillStyle = "rgba(0,0,0,.1)";
      ctx.fillRect(0, 0, width, height);

      for (let i = e.length; i--;) {
        const u = e[i];
        const q = targetPoints[u.q];
        const dx = u.trace[0].x - q[0];
        const dy = u.trace[0].y - q[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (10 > length) {
          if (0.95 < rand()) {
            u.q = ~~(rand() * heartPointsCount);
          } else {
            if (0.99 < rand()) u.D *= -1;
            u.q += u.D;
            u.q %= heartPointsCount;
            if (0 > u.q) u.q += heartPointsCount;
          }
        }
        
        u.vx += -dx / length * u.speed;
        u.vy += -dy / length * u.speed;
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;
        u.vx *= u.force;
        u.vy *= u.force;
        
        for (let k = 0; k < u.trace.length - 1;) {
          const T = u.trace[k];
          const N = u.trace[++k];
          N.x -= config.traceK * (N.x - T.x);
          N.y -= config.traceK * (N.y - T.y);
        }

        ctx.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++) {
          ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* Buttons */}
      <div className="fixed top-8 left-8 z-50">
        <Link to="/" className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
      <div className="fixed top-8 right-8 z-50">
        <button onClick={toggleAudio} className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:bg-white/10 hover:text-rose-400 transition-all flex items-center justify-center">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* --- TEXT OVERLAY WITH PREMIUM FONTS --- */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center"
          >
            <p 
              className="text-white/95 text-4xl md:text-6xl tracking-wide leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontStyle: "italic", 
                fontWeight: 600 
              }} 
            >
              {messages[textIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <audio ref={audioRef} src="/heartbeat.mp3" loop />
    </div>
  );
}