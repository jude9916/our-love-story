// src/pages/Memories.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Upload, X, Calendar, ArrowLeft, Image as ImageIcon, 
  Loader2, Trash2, Film, Music, Sparkles, Clock // Added Clock Icon
} from 'lucide-react';
import { toast } from "sonner"; 
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoveNotes from '@/components/LoveNotes';

// --- CONFIGURATION ---
// ⚠️ REPLACE THIS with your Cloudflare R2 Public Domain
const R2_PUBLIC_DOMAIN = "https://pub-f066d2e2b9bb48e8bbb188a201e6fb7c.r2.dev"; 

// --- Types ---
interface Memory {
  id: string;
  image_url: string;
  caption: string;
  memory_date: string;
  media_type: 'image' | 'video' | 'audio';
}

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'audio'>('image');
  const [caption, setCaption] = useState('');
  
  // ⚡ TIME CAPTURE UPDATE: format defaults to YYYY-MM-DDTHH:mm
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  // 1. Fetch memories from Database on load
  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('memory_date', { ascending: false });

      if (error) throw error;
      if (data) setMemories(data as Memory[]);
    } catch (error) {
      console.error('Error loading memories:', error);
      toast.error("Could not load memories");
    } finally {
      setLoading(false);
    }
  };

  // 2. DELETE FUNCTIONALITY
  const deleteMemory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;

    try {
        const { error: dbError } = await supabase.from('memories').delete().eq('id', id);
        if (dbError) throw dbError;

        setMemories(memories.filter(m => m.id !== id));
        toast.success("Memory deleted");
    } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Could not delete memory");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 500 * 1024 * 1024) { // 500MB
        toast.error("File is too large! Please upload files under 500MB.");
        return;
      }

      let type: 'image' | 'video' | 'audio' = 'image';
      if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';

      setSelectedFile(file);
      setFileType(type);
      setPreviewUrl(URL.createObjectURL(file));
      
      // ⚡ TIME CAPTURE UPDATE: Auto-set to NOW (Date + Time)
      // This gets the local time correct by adjusting for timezone offset
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setDate(now.toISOString().slice(0, 16));
      
      setIsUploading(true);
    }
  };

  // 3. THE NEW CLOUDFLARE R2 UPLOAD LOGIC
  const saveMemory = async () => {
    if (!selectedFile || !date) {
        toast.error("Please select a file and date");
        return;
    }
    
    setIsSaving(true);

    try {
        const fileExt = selectedFile.name.split('.').pop();
        const safeName = selectedFile.name.replace(/[^a-zA-Z0-9]/g, '_'); 
        const fileName = `${Date.now()}-${safeName}.${fileExt}`;
        
        const { data: funcData, error: funcError } = await supabase.functions.invoke('upload-to-r2', {
            body: { 
                filename: fileName, 
                fileType: selectedFile.type 
            },
        });

        if (funcError) throw new Error(`Auth Error: ${funcError.message}`);
        if (!funcData?.url) throw new Error("Could not generate secure upload URL");

        const uploadResponse = await fetch(funcData.url, {
            method: 'PUT',
            headers: { 'Content-Type': selectedFile.type },
            body: selectedFile,
        });

        if (!uploadResponse.ok) throw new Error('Failed to upload file to cloud storage');

        const publicUrl = `${R2_PUBLIC_DOMAIN}/${fileName}`;

        const { error: dbError } = await supabase
            .from('memories')
            .insert([{
                image_url: publicUrl,
                caption: caption,
                memory_date: date, // Saves full datetime string
                media_type: fileType
            }]);

        if (dbError) throw new Error(`Database failed: ${dbError.message}`);

        toast.success("Saved securely to Our Fantasy World! ☁️");
        await fetchMemories(); 
        resetUpload();

    } catch (error: any) {
        console.error('Upload failed:', error);
        toast.error(error.message || "Upload failed. Try again.");
    } finally {
        setIsSaving(false);
    }
  };

  const resetUpload = () => {
    setIsUploading(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption('');
    // Reset to current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDate(now.toISOString().slice(0, 16));
    
    setFileType('image');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- BENTO GRID HELPER ---
  const getBentoClass = (index: number, type: string) => {
    if (type === 'video') return "md:col-span-2 md:row-span-2";
    if (index === 0) return "md:col-span-2 md:row-span-2"; 
    if (index % 6 === 0) return "md:col-span-2";
    return "col-span-1 row-span-1";
  };

  // Helper to render media content
  const renderMedia = (mem: Memory, isPreview = false) => {
    const commonClass = isPreview 
        ? "h-full w-full object-contain" 
        : "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105";

    if (mem.media_type === 'video' || (isPreview && fileType === 'video')) {
        return (
            <div className="w-full h-full bg-black flex items-center justify-center">
                <video 
                    src={mem.image_url} 
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                />
            </div>
        );
    }
    if (mem.media_type === 'audio' || (isPreview && fileType === 'audio')) {
        return (
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative group p-4">
                <Music className="w-12 h-12 text-rose-500 relative z-10 animate-pulse mb-4" />
                <audio src={mem.image_url} controls className="w-full max-w-[90%] relative z-20 pointer-events-auto" />
            </div>
        );
    }
    return (
        <img 
            src={mem.image_url} 
            alt={mem.caption} 
            className={commonClass}
            loading="lazy"
        />
    );
  };

  // Helper to format date nicely (e.g., "Feb 14 • 10:30 PM")
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
           " • " + 
           d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-rose-100 pb-32">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2">
            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm md:text-base">Home</span>
          </Link>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <div className="p-1.5 bg-rose-50 rounded-full">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
            <span className="font-semibold text-gray-800 tracking-tight">Cloud Gallery</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-32 px-4 md:px-6">
        
        {/* Love Notes Section */}
        <div className="mb-12">
            <LoveNotes />
        </div>

        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            </div>
        ) : (
            <AnimatePresence mode="wait">
            {memories.length === 0 ? (
                <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center py-20 min-h-[50vh]"
                >
                <div className="w-24 h-24 bg-gradient-to-tr from-rose-50 to-orange-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <ImageIcon className="w-10 h-10 text-rose-300/80" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                    Our Forever Wall
                </h2>
                <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">
                    Photos, videos, and songs uploaded here are saved safely in our fantasy world!.
                </p>
                
                {/* --- ROMANTIC EMPTY STATE BUTTON --- */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative px-8 py-4 bg-gray-900 text-white rounded-full font-medium shadow-xl shadow-gray-200 hover:shadow-2xl hover:bg-gray-800 transition-all active:scale-95"
                >
                    <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-200" /> 
                        Add Our First Magic Moment
                    </span>
                </button>
                </motion.div>
            ) : (
                /* --- BENTO GRID LAYOUT --- */
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px] gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                {memories.map((mem, index) => (
                    <motion.div
                        layoutId={mem.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={mem.id}
                        className={`relative group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden ${getBentoClass(index, mem.media_type)}`}
                    >
                        <div className="absolute inset-0 w-full h-full bg-gray-100 z-10">
                             {renderMedia(mem)}
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-20 pointer-events-none">
                             <div className="flex items-start justify-between">
                                 <div>
                                     <p className="font-medium text-white text-lg leading-tight line-clamp-2 drop-shadow-md">
                                        {mem.caption || "Untitled"}
                                     </p>
                                     <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-white/80 bg-black/20 backdrop-blur-md px-2 py-1 rounded-md">
                                            {/* ⚡ UPDATED DATE DISPLAY (Includes Time) */}
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(mem.memory_date)}</span>
                                        </div>
                                     </div>
                                 </div>
                                 
                                 <button 
                                     onClick={(e) => {
                                         e.stopPropagation();
                                         deleteMemory(mem.id);
                                     }}
                                     className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors pointer-events-auto"
                                     title="Delete Memory"
                                 >
                                     <Trash2 className="w-4 h-4" />
                                 </button>
                             </div>
                        </div>

                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/20 backdrop-blur-md rounded-md z-30 pointer-events-none">
                            {mem.media_type === 'video' ? <Film className="w-3 h-3 text-white" /> : 
                             mem.media_type === 'audio' ? <Music className="w-3 h-3 text-white" /> : 
                             <ImageIcon className="w-3 h-3 text-white" />}
                        </div>

                    </motion.div>
                ))}
                </motion.div>
            )}
            </AnimatePresence>
        )}
      </main>

      {/* FAB (Only shows if there are items) */}
      <AnimatePresence>
        {!loading && memories.length > 0 && (
            <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => fileInputRef.current?.click()}
            /* --- ROMANTIC FAB --- */
            className="fixed bottom-10 right-8 md:right-12 w-16 h-16 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-rose-500 hover:scale-110 active:scale-95 transition-all z-40"
            >
            <Heart className="w-7 h-7 fill-current" />
            </motion.button>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="image/*,video/*,audio/*" 
        className="hidden" 
      />
      
      {/* --- FIXED UPLOAD MODAL --- */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={resetUpload} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden z-10"
            >
              
              <div className="relative h-64 shrink-0 bg-black flex items-center justify-center">
                {previewUrl && (
                    <div className="w-full h-full">
                          {renderMedia({ 
                            id: 'preview', 
                            image_url: previewUrl, 
                            caption: '', 
                            memory_date: '', 
                            media_type: fileType 
                        }, true)}
                    </div>
                )}
                
                <button 
                  onClick={resetUpload} 
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 z-20 transition-transform hover:scale-110"
                >
                    <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Caption</label>
                    <input 
                      type="text" 
                      placeholder={`Describe this ${fileType}...`} 
                      value={caption} 
                      onChange={e => setCaption(e.target.value)} 
                      className="w-full p-4 bg-gray-50 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 outline-none transition-all" 
                      autoFocus 
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</label>
                    {/* ⚡ DATE + TIME INPUT */}
                    <input 
                      type="datetime-local" 
                      value={date} 
                      onChange={e => setDate(e.target.value)} 
                      className="w-full p-4 bg-gray-50 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 outline-none transition-all" 
                    />
                </div>

                <button 
                    onClick={saveMemory} 
                    disabled={isSaving}
                    className="w-full py-4 bg-gray-900 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-98 mt-2 disabled:bg-gray-400 flex justify-center items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        /* --- ROMANTIC MODAL BUTTON --- */
                        <span className="flex items-center gap-2">
                            <Heart className="w-5 h-5 fill-current" />
                            Save in Our Fantasy World!
                        </span>
                    )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}