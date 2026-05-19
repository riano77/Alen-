import React from 'react';
import { 
  Plus, 
  Search, 
  Settings, 
  Folder, 
  Star, 
  FileText, 
  Trash2, 
  ChevronRight,
  Notebook as NotebookIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Notebook } from '../types';

interface SidebarProps {
  notebooks: Notebook[];
  activeNotebookId: string | 'all' | 'pinned';
  onSelectNotebook: (id: string | 'all' | 'pinned') => void;
  onAddNotebook: () => void;
}

export default function Sidebar({ 
  notebooks, 
  activeNotebookId, 
  onSelectNotebook, 
  onAddNotebook 
}: SidebarProps) {
  return (
    <aside className="w-64 border-r border-zinc-200 bg-zinc-50/50 flex flex-col h-screen flex-shrink-0 overflow-hidden">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
          <NotebookIcon className="w-5 h-5" />
        </div>
        <h1 className="font-sans font-medium tracking-tight text-zinc-900">Lumina</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-4 pt-2">
        <div className="space-y-1">
          <button
            id="nav-all"
            onClick={() => onSelectNotebook('all')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              activeNotebookId === 'all' 
                ? "bg-white shadow-sm border border-zinc-200 text-zinc-900" 
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            <FileText className="w-4 h-4 text-zinc-400" />
            All Notes
          </button>
          <button
            id="nav-pinned"
            onClick={() => onSelectNotebook('pinned')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              activeNotebookId === 'pinned' 
                ? "bg-white shadow-sm border border-zinc-200 text-zinc-900" 
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            <Star className="w-4 h-4 text-orange-400" />
            Pinned
          </button>
        </div>

        <div>
          <div className="px-3 py-2 flex items-center justify-between group">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Notebooks</span>
            <button 
              onClick={onAddNotebook}
              className="p-1 rounded hover:bg-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
          <div className="space-y-1">
            {notebooks.map((notebook) => (
              <button
                key={notebook.id}
                id={`notebook-${notebook.id}`}
                onClick={() => onSelectNotebook(notebook.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group",
                  activeNotebookId === notebook.id 
                    ? "bg-white shadow-sm border border-zinc-200 text-zinc-900" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: notebook.color || '#94a3b8' }} 
                  />
                  {notebook.name}
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-zinc-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
