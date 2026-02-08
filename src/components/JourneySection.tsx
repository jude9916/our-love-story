import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Heart, MapPin } from 'lucide-react';

const MILESTONES = [
  {
    date: "The Beginning",
    title: "When Stars Aligned",
    description: "The day I first saw you. I didn't believe in destiny until that moment.",
    icon: Calendar,
  },
  {
    date: "The Spark",
    title: "Falling for You",
    description: "It wasn't a sudden fall, but a slow realization that my world was better with you in it.",
    icon: Heart,
  },
  {
    date: "The Journey",
    title: "Every Moment Since",
    description: "From our late night talks to our silent moments. Every second is a memory I cherish.",
    icon: MapPin,
  },
  {
    date: "Today",
    title: "The Realization",
    description: "I realized that I don't just want you for now. I want you for every tomorrow.",
    icon: Heart,
  }
];

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    // 👇 FIX 1: Removed 'snap-start' from here. Now it won't get stuck at the top!
    <section ref={containerRef} className="relative py-32 bg-black overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-900/10 via-black to-black" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display text-center text-white mb-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          Our Story
        </motion.h2>

        <div className="relative max-w-4xl mx-auto">
          
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 md:-translate-x-1/2 rounded-full overflow-hidden">
             <motion.div 
               style={{ scaleY, transformOrigin: "top" }}
               className="w-full h-full bg-gradient-to-b from-rose-500 via-purple-500 to-rose-500 shadow-[0_0_20px_#f43f5e]"
             />
          </div>

          <div className="space-y-24 md:space-y-32">
            {MILESTONES.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ item, index }: { item: any, index: number }) => {
  const isEven = index % 2 === 0;
  const Icon = item.icon;

  return (
    // 👇 FIX 2: Added 'snap-center'. Now scrolling snaps gently to each memory.
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`snap-center relative flex items-center md:justify-between ${isEven ? 'flex-row' : 'md:flex-row-reverse'}`}
    >
      
      <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-rose-500 rounded-full md:-translate-x-1/2 border-4 border-black shadow-[0_0_15px_#f43f5e] z-20">
         <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20" />
      </div>

      <div className="hidden md:block w-5/12" />

      <div className="pl-20 md:pl-0 w-full md:w-5/12">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300 group">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-rose-500/20 rounded-full group-hover:bg-rose-500/30 transition-colors">
                 <Icon className="w-6 h-6 text-rose-400" />
              </div>
              <span className="font-display text-rose-200/80 text-sm tracking-widest uppercase">{item.date}</span>
           </div>
           
           <h3 className="text-2xl text-white font-display mb-3 group-hover:text-rose-200 transition-colors">
             {item.title}
           </h3>
           
           <p className="text-rose-100/60 font-body leading-relaxed">
             {item.description}
           </p>
        </div>
      </div>

    </motion.div>
  );
};

export default JourneySection;