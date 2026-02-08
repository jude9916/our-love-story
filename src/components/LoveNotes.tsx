// src/components/LoveNotes.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Sparkles, MessageCircleHeart, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

// --- Types ---
interface Note {
  id: string;
  content: string;
  sender: 'Jude' | 'Sam'; // NEW: Tracks who sent it
}

export default function LoveNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW: Toggle State (Defaults to Jude)
  const [currentSender, setCurrentSender] = useState<'Jude' | 'Sam'>('Jude');

  // Load notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('love_notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setNotes(data as Note[]);
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    
    // NEW: We now send the 'sender' field to Supabase
    const { error } = await supabase
      .from('love_notes')
      .insert([{ 
        content: newNote,
        sender: currentSender 
      }]);

    if (error) {
      console.error(error);
      toast.error("Failed to send note");
    } else {
      toast.success("Saved in our memories! 💕");
      setNewNote('');
      fetchNotes(); // Refresh list
    }
    setIsSubmitting(false);
  };

  const deleteNote = async (id: string) => {
    if(!confirm("Delete this note?")) return;
    
    const { error } = await supabase
        .from('love_notes')
        .delete()
        .eq('id', id);

    if (!error) {
        setNotes(notes.filter(n => n.id !== id));
        toast.success("Note removed");
    }
  };

  return (
    <section className="py-20 px-4 md:px-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-rose-50 rounded-full mb-4">
            <MessageCircleHeart className="w-6 h-6 text-rose-500" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
           Our Little Notes
        </h2>
        <p className="text-gray-500">Things we want to tell each other.</p>
      </div>

      {/* NEW: Sender Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button 
          type="button"
          onClick={() => setCurrentSender('Jude')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform ${
            currentSender === 'Jude' 
              ? 'bg-gray-900 text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-gray-900' 
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span>🤵 I'm Jude</span>
        </button>
        <button 
          type="button"
          onClick={() => setCurrentSender('Sam')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform ${
            currentSender === 'Sam' 
              ? 'bg-rose-500 text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-rose-500' 
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-rose-50'
          }`}
        >
          <span>👰 I'm Sam</span>
        </button>
      </div>

      {/* Input Area */}
      <form onSubmit={addNote} className="mb-16 relative max-w-xl mx-auto">
        <div className="relative group">
            <div className={`absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200 bg-gradient-to-r ${currentSender === 'Jude' ? 'from-gray-400 to-gray-600' : 'from-rose-300 to-pink-300'}`}></div>
            <div className="relative flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={currentSender === 'Jude' ? "Write something for Sam..." : "Write something for Jude..."}
                className="flex-1 p-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
                />
                <button 
                disabled={isSubmitting}
                className={`text-white p-4 rounded-xl transition-all disabled:opacity-50 hover:scale-105 active:scale-95 ${currentSender === 'Jude' ? 'bg-gray-900 hover:bg-black' : 'bg-rose-500 hover:bg-rose-600'}`}
                >
                <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
      </form>

      {/* The Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${
                note.sender === 'Sam' ? 'border-rose-100' : 'border-gray-100'
              }`}
            >
              <p className="text-lg text-gray-700 font-medium leading-relaxed font-handwriting mb-4">
                "{note.content}"
              </p>
              
              {/* Badge showing who sent it */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                note.sender === 'Sam' ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {note.sender === 'Sam' ? '👰 From Sam' : '🤵 From Jude'}
              </div>

              {/* Delete Button */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => deleteNote(note.id)}
                    className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <Sparkles className={`w-4 h-4 ${note.sender === 'Sam' ? 'text-rose-200' : 'text-gray-200'}`} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {notes.length === 0 && (
        <div className="text-center text-gray-400 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p>No notes yet.</p>
            <p className="text-sm mt-1">Be the first to write something sweet! ✍️</p>
        </div>
      )}
    </section>
  );
}