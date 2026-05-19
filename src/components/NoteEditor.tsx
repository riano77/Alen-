import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Pin, 
  Share2, 
  MoreHorizontal,
  Heading1,
  Heading2,
  Type,
  List as ListIcon,
  CheckSquare,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  ChevronLeft,
  X,
  LayoutGrid
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Note } from '../types';
import { cn, formatDate } from '../lib/utils';
import { summarizeNote, generateAIContent } from '../services/aiService';
import confetti from 'canvas-confetti';

interface NoteEditorProps {
  note: Note | null;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

export default function NoteEditor({ note, onUpdate, onDelete, onClose }: NoteEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isAISummarizing, setIsAISummarizing] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  useEffect(() => {
    setAiResult(null);
  }, [note?.id]);

  if (!note) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-zinc-200" />
        </div>
        <h3 className="text-zinc-900 font-medium font-sans">Select a note to read</h3>
        <p className="text-zinc-400 text-sm max-w-xs mt-2">
          Choose a note from the sidebar or create a new one to start capturing your thoughts.
        </p>
      </div>
    );
  }

  const handleSummarize = async () => {
    if (!note.content) return;
    setIsAISummarizing(true);
    try {
      const result = await summarizeNote(note.content);
      setAiResult(result.text);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#000', '#666', '#AAA']
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAISummarizing(false);
    }
  };

  const handleExpandContent = async () => {
    if (!note.content) return;
    setIsAIGenerating(true);
    try {
      const result = await generateAIContent(
        `Help me expand this note idea with more details and structured points:\n\n${note.content}`,
        "You are a helpful brainstorming partner. Expand the user's ideas with relevant details, suggestions, and creative insights."
      );
      setAiResult(result.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAIGenerating(false);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-screen overflow-hidden relative">
      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between flex-shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          {onClose && (
            <button onClick={onClose} className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 lg:hidden">
              <ChevronLeft className="w-5 h-5 text-zinc-600" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-100 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab('write')}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  activeTab === 'write' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                Write
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  activeTab === 'preview' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                Preview
              </button>
            </div>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">
                Updated {formatDate(note.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdate(note.id, { isPinned: !note.isPinned })}
            className={cn(
              "p-2 rounded-lg transition-colors border",
              note.isPinned 
                ? "bg-orange-50 border-orange-100 text-orange-600" 
                : "text-zinc-400 border-transparent hover:bg-zinc-50"
            )}
          >
            <Pin className={cn("w-4 h-4", note.isPinned && "fill-current")} />
          </button>
          <button 
            onClick={() => onDelete(note.id)}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-zinc-100 mx-2" />
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </header>

      {/* AI Controls Bar */}
      <div className="px-6 py-2 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <button 
          onClick={handleSummarize}
          disabled={isAISummarizing || !note.content}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-all disabled:opacity-50 group"
        >
          <Sparkles className={cn("w-3.5 h-3.5", isAISummarizing ? "animate-pulse text-indigo-500" : "text-zinc-400 group-hover:text-indigo-500")} />
          {isAISummarizing ? 'Summarizing...' : 'Summarize'}
        </button>
        <button 
          onClick={handleExpandContent}
          disabled={isAIGenerating || !note.content}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-all disabled:opacity-50 group"
        >
          <LayoutGrid className={cn("w-3.5 h-3.5", isAIGenerating ? "animate-pulse text-violet-500" : "text-zinc-400 group-hover:text-violet-500")} />
          AI Brainstorm
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-all text-zinc-400">
          <ImageIcon className="w-3.5 h-3.5" />
          Add Image
        </button>
      </div>

      {/* Editor Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <input
            type="text"
            value={note.title}
            onChange={(e) => onUpdate(note.id, { title: e.target.value })}
            placeholder="Note Title"
            className="w-full text-4xl font-sans font-bold text-zinc-900 placeholder:text-zinc-200 outline-none border-none bg-transparent selection:bg-zinc-100"
          />

          <AnimatePresence>
            {aiResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 relative group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-indigo-700 font-medium text-sm">
                    <Sparkles className="w-4 h-4" />
                    AI Assistant
                  </div>
                  <button 
                    onClick={() => setAiResult(null)}
                    className="p-1 rounded-full hover:bg-indigo-100 text-indigo-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-zinc-700 text-sm prose prose-indigo max-w-none prose-sm leading-relaxed">
                  <ReactMarkdown>{aiResult}</ReactMarkdown>
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => {
                       onUpdate(note.id, { content: `${note.content}\n\n---\n\n### AI Insight\n${aiResult}` });
                       setAiResult(null);
                    }}
                    className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Append to note
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'write' ? (
            <textarea
              value={note.content}
              onChange={(e) => onUpdate(note.id, { content: e.target.value })}
              placeholder="Start writing..."
              className="w-full min-h-[60vh] text-lg text-zinc-700 placeholder:text-zinc-200 outline-none border-none bg-transparent resize-none leading-relaxed selection:bg-zinc-100"
            />
          ) : (
            <div className="prose prose-zinc max-w-none text-zinc-800 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-zinc-900 prose-img:rounded-2xl">
              <ReactMarkdown>{note.content || '*Empty note*'}</ReactMarkdown>
            </div>
          )}
        </div>
      </main>

      {/* Floating Toolbar */}
      <footer className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-white border border-zinc-200 rounded-2xl shadow-xl z-20 backdrop-blur-md bg-white/80">
        <button className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"><Heading1 className="w-4 h-4" /></button>
        <button className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"><Heading2 className="w-4 h-4" /></button>
        <button className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"><Type className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-zinc-200 mx-1" />
        <button className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"><ListIcon className="w-4 h-4" /></button>
        <button className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"><CheckSquare className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-zinc-200 mx-1" />
        <button className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"><ImageIcon className="w-4 h-4" /></button>
      </footer>
    </div>
  );
}

// Fallback icon
import { FileText } from 'lucide-react';
