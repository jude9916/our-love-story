import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, IndianRupee, ShieldCheck, FileText, Heart, Sparkles } from 'lucide-react';

const Ticket = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto mt-8 min-h-[600px] flex items-center justify-center relative perspective-1000">
      <AnimatePresence mode="wait">
        
        {/* STATE 1: THE TICKET */}
        {!isRevealed ? (
          <motion.div 
            key="ticket"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="w-full relative z-10"
          >
            <div className="relative bg-[#fdf6ec] rounded-[30px] p-8 shadow-2xl overflow-hidden text-left">
              
              {/* HEADER */}
              <div className="text-center mb-6">
                <p className="text-rose-400 text-[10px] font-bold tracking-widest uppercase mb-2">
                  Admit One - VIP Access to My Heart
                </p>
                <h2 className="font-display text-4xl text-[#4a2c2a] mb-6">
                  Date Night Ticket
                </h2>
                <div className="w-full border-t-2 border-dashed border-[#4a2c2a]/20" />
              </div>

              {/* DETAILS */}
              <div className="space-y-4 relative z-10">
                <TicketRow icon={Calendar} label="Date" value="Started Since I Met You My Love 🌎 ❤️" />
                <TicketRow icon={Clock} label="Time" value="Every second of my life 😍" />
                <TicketRow icon={ShieldCheck} label="Expiration" value="Never. Forever Valid. 🌕 ✨" />
                <TicketRow icon={IndianRupee} label="Price" value="One Smile 🤗 🤌" />
                
                {/* 👇 ADDED T&C ROW HERE */}
                <TicketRow icon={FileText} label="T&C" value="Non-refundable & strictly non-transferable 𓆩❤︎𓆪" />
                
                <TicketRow icon={MapPin} label="Location" value="Right beside you 🧿" />
              </div>

              {/* NOTCHES */}
              <div className="absolute top-1/2 -left-4 w-8 h-8 bg-black rounded-full" />
              <div className="absolute top-1/2 -right-4 w-8 h-8 bg-black rounded-full" />

              {/* FOOTER */}
              <div className="mt-8 text-center">
                 <div className="w-full border-t-2 border-dashed border-[#4a2c2a]/20 mb-6" />
                 <p className="font-serif italic text-[#4a2c2a] text-lg mb-4 opacity-80 px-4">
                  "You are the only view I want to see."
                 </p>
                 <button 
                   onClick={() => setIsRevealed(true)}
                   className="w-full py-4 bg-[#570a0a] text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-[#6b1212] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                   <span>Claim This Moment</span>
                   <Heart className="w-5 h-5 fill-current animate-pulse" />
                 </button>
              </div>

            </div>
          </motion.div>
        ) : (
          
          /* STATE 2: THE REVEAL */
          <motion.div 
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative w-full aspect-[3/4] bg-black rounded-[30px] overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.4)] border border-white/10"
          >
            <motion.img 
              src="/samjude1.jpg" 
              alt="My Love"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center pb-16">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <h3 className="font-display text-3xl md:text-4xl text-white mb-4 leading-tight drop-shadow-lg">
                  It was never about the ticket.
                </h3>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
              >
                <p className="font-body text-xl text-rose-200 font-light leading-relaxed mb-6">
                  "It was always about You."
                </p>
                
                <div className="inline-block px-6 py-2 border border-rose-500/50 rounded-full bg-rose-500/10 backdrop-blur-md">
                  <span className="text-rose-100 text-sm tracking-widest uppercase">
                    I Love You, Sam
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

// Helper Component
const TicketRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex gap-4 items-start">
    <div className="mt-1 bg-amber-100 p-1.5 rounded-full shrink-0">
      <Icon className="w-4 h-4 text-amber-600" />
    </div>
    <div>
      <p className="text-[#4a2c2a]/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[#4a2c2a] font-medium text-sm leading-tight">
        {value}
      </p>
    </div>
  </div>
);

export default Ticket;