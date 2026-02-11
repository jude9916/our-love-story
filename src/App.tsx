import { useState, useEffect } from "react"; // 👈 1. Import Hooks
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WhyHer from "./pages/WhyHer";
import Valentine from "./pages/Valentine";
import PinkHeart from "./pages/PinkHeart";
import Home from "./pages/Home"; 
import Memories from "./pages/Memories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // 👇 2. Add Loading State
  const [loading, setLoading] = useState(true);

  // 👇 3. Timer Logic (3.5 seconds of magic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <BrowserRouter>
          {/* 👇 4. CONDITIONAL RENDERING */}
          {loading ? (
            /* --- THE SPLASH SCREEN --- */
            <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
               {/* We render the Pink Heart as the background */}
               <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
                 <PinkHeart />
               </div>
               
               {/* Loading Text Overlay */}
               <div className="relative z-10 mt-40 animate-pulse flex flex-col items-center gap-2">
                 <div className="w-12 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full" />
                 <p className="text-pink-200/80 font-serif tracking-[0.3em] text-xs uppercase">
                   Loading Our Universe...
                 </p>
                 <div className="w-12 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full" />
               </div>
            </div>
          ) : (
            /* --- THE REAL APP --- */
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/memories" element={<Memories />} />
              <Route path="/why-her" element={<WhyHer />} />
              <Route path="/valentine" element={<Valentine />} />
              <Route path="/pink-heart" element={<PinkHeart />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;