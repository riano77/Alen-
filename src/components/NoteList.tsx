import React from 'react';
import { Search, Plus, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function NoteList({
  notes,
  activeNoteId,
  onSelectNote,
  onAddNote,
  searchQuery,
  onSearchChange
}: NoteListProps) {
  return (
    <div className="w-80 border-r border-zinc-100 bg-white flex flex-col h-screen flex-shrink-0">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-sans font-semibold text-xl text-zinc-900">Notes</h2>
          <button 
            onClick={onAddNote}
            id="add-note-btn"
            className="p-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-100 border-none rounded-xl text-sm focus:ring-1 focus:ring-zinc-900 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {notes.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center">
              <Search className="w-6 h-6 text-zinc-300" />
            </div>
            <p className="text-sm text-zinc-400 font-medium">No notes found</p>
          </div>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              id={`note-card-${note.id}`}
              onClick={() => onSelectNote(note.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all border group relative",
                activeNoteId === note.id
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-lg"
                  : "bg-white border-transparent hover:bg-zinc-50 hover:border-zinc-200"
              )}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={cn(
                    "font-medium text-sm truncate",
                    activeNoteId === note.id ? "text-white" : "text-zinc-900"
                  )}>
                    {note.title || 'Untitled Note'}
                  </h3>
                  {note.isPinned && (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      activeNoteId === note.id ? "bg-white" : "bg-orange-400"
                    )} />
                  )}
                </div>
                <p className={cn(
                  "text-xs line-clamp-2",
                  activeNoteId === note.id ? "text-zinc-300" : "text-zinc-500"
                )}>
                  {note.content || 'Empty note...'}
                </p>
                <div className={cn(
                  "mt-2 text-[10px] font-mono",
                  activeNoteId === note.id ? "text-zinc-400" : "text-zinc-400"
                )}>
                  {formatDate(note.updatedAt)}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
