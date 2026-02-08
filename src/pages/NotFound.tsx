// src/pages/NotFound.tsx
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4 text-center">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-8"
      >
        {/* The "Lost" Map Pin */}
        <div className="relative z-10 bg-white p-6 rounded-full shadow-xl shadow-rose-100/50 ring-1 ring-rose-100">
            <MapPin className="w-16 h-16 text-rose-500" />
        </div>
        
        {/* Animated Heartbeat behind it */}
        <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-rose-200 rounded-full opacity-20 blur-xl"
        />
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-6xl font-bold text-gray-900 mb-2 tracking-tight"
      >
        404
      </motion.h1>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-medium text-gray-800 mb-4"
      >
        I'm completely lost...
      </motion.h2>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-500 max-w-md mx-auto mb-10 leading-relaxed"
      >
        I tried to find the page you were looking for, but I got distracted getting lost in your love instead. 💕
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium shadow-lg hover:bg-rose-500 hover:scale-105 active:scale-95 transition-all duration-300 group"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Guide Me Home</span>
            <Heart className="w-4 h-4 fill-current text-rose-300 group-hover:text-white transition-colors" />
        </Link>
      </motion.div>

    </div>
  );
};

export default NotFound;