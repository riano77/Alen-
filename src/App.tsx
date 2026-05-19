import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import { Note, Notebook, AppState } from './types';

const INITIAL_NOTEBOOKS: Notebook[] = [
  { id: 'personal', name: 'Personal', color: '#6366f1' },
  { id: 'work', name: 'Work', color: '#f59e0b' },
  { id: 'ideas', name: 'Deep Ideas', color: '#10b981' },
];

const STORAGE_KEY = 'lumina_notebook_state';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
    return {
      notes: [],
      notebooks: INITIAL_NOTEBOOKS,
      activeNotebookId: 'all',
      activeNoteId: null,
      searchQuery: '',
    };
  });

  // Save state on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const filteredNotes = useMemo(() => {
    let filtered = state.notes;

    if (state.activeNotebookId === 'pinned') {
      filtered = filtered.filter(n => n.isPinned);
    } else if (state.activeNotebookId !== 'all') {
      filtered = filtered.filter(n => n.notebookId === state.activeNotebookId);
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.content.toLowerCase().includes(query)
      );
    }

    // Sort by updated date
    return [...filtered].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [state.notes, state.activeNotebookId, state.searchQuery]);

  const activeNote = useMemo(() => 
    state.notes.find(n => n.id === state.activeNoteId) || null
  , [state.notes, state.activeNoteId]);

  const handleAddNote = () => {
    const notebookId = (state.activeNotebookId === 'all' || state.activeNotebookId === 'pinned') 
      ? (state.notebooks[0]?.id || '') 
      : state.activeNotebookId;
    
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      content: '',
      notebookId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      isPinned: false
    };

    setState(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes],
      activeNoteId: newNote.id
    }));
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n)
    }));
  };

  const handleDeleteNote = (id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id),
      activeNoteId: prev.activeNoteId === id ? null : prev.activeNoteId
    }));
  };

  const handleAddNotebook = () => {
    const name = window.prompt("Enter notebook name:");
    if (!name) return;
    
    const newNotebook: Notebook = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    setState(prev => ({
      ...prev,
      notebooks: [...prev.notebooks, newNotebook]
    }));
  };

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      <Sidebar 
        notebooks={state.notebooks}
        activeNotebookId={state.activeNotebookId}
        onSelectNotebook={(id) => setState(prev => ({ ...prev, activeNotebookId: id }))}
        onAddNotebook={handleAddNotebook}
      />
      
      <NoteList 
        notes={filteredNotes}
        activeNoteId={state.activeNoteId}
        onSelectNote={(id) => setState(prev => ({ ...prev, activeNoteId: id }))}
        onAddNote={handleAddNote}
        searchQuery={state.searchQuery}
        onSearchChange={(query) => setState(prev => ({ ...prev, searchQuery: query }))}
      />

      <NoteEditor 
        note={activeNote}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
        onClose={() => setState(prev => ({ ...prev, activeNoteId: null }))}
      />
    </div>
  );
}
