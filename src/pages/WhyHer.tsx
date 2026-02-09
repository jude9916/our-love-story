import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Shield, Sun, Users, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WhyHer() {
  
  // 📸 STEP 1: PASTE YOUR BEST 3 PHOTO LINKS HERE
  // Go to your "Forever Wall", right-click a photo, "Copy Image Address", and paste here.
  const galleryImages = [
    {
      url: "https://placehold.co/600x400/rose/white?text=Our+Smile", // Replace this!
      caption: "She makes me smile effortlessly."
    },
    {
      url: "https://placehold.co/600x400/blue/white?text=Travel", // Replace this!
      caption: "Exploring the world together."
    },
    {
      url: "https://placehold.co/600x400/orange/white?text=Festival", // Replace this!
      caption: " celebrating traditions."
    }
  ];

  const reasons = [
    {
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      title: "She is my Peace",
      desc: "In my busy life with bikes and work, she is the calm. When I am stressed, just one conversation with her grounds me."
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: "She Supports My Dreams",
      desc: "Whether it's my career or my passion for 'Business', she pushes me to be better every single day."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Her Values",
      desc: "She respects family, values hard work, and has a kindness that is rare to find. She treats everyone with dignity."
    },
    {
      icon: <Sun className="w-6 h-6 text-orange-500" />,
      title: "We Grow Together",
      desc: "We aren't just partners; we are a team. We help each other learn, earn, and build a future."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* Header */}
      <nav className="p-6 flex items-center sticky top-0 bg-slate-50/80 backdrop-blur-md z-50">
        <Link to="/" className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors border border-slate-200">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <span className="ml-4 font-serif font-bold text-slate-700">For Mom & Sis</span>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-10">
        
        {/* Hero Section */}
        <section className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
          >
            The Decision
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6"
          >
            Why Sampritha?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            To my family, I want to tell you why she is the person I want to walk through life with.
          </motion.p>
        </section>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {reasons.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-3 bg-slate-50 rounded-2xl w-fit mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* --- NEW SECTION: PHOTO GALLERY --- */}
        <section className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center justify-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-500" /> Moments of Happiness
            </h2>
            <p className="text-slate-500 mt-2">Just seeing us together explains what words cannot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {galleryImages.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md border border-slate-100"
              >
                <img 
                  src={img.url} 
                  alt="Us" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Letter to Parents */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200 border border-slate-100 relative overflow-hidden mb-20"
        >
          {/* Decorative Background Icon */}
          <Users className="absolute -top-10 -right-10 w-64 h-64 text-slate-50 opacity-50" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">A Promise to Amma & Akka</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed font-serif text-lg">
              <p>
                I know that choosing a partner is a big decision, not just for me, but for our family.
              </p>
              <p>
                I chose Sampritha because she holds the same values we do. She is respectful, hardworking, and cares deeply about family. With her, I am more focused on my goals and more confident about the future.
              </p>
              <p>
                She isn't just a girlfriend; she is my partner in everything. I hope you can see the happiness she brings to my life.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100">
              <p className="font-bold text-slate-900">With Love,</p>
              <p className="text-slate-500">Jude</p>
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
}