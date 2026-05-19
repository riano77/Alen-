export interface Note {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isPinned: boolean;
}

export interface Notebook {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface AppState {
  notes: Note[];
  notebooks: Notebook[];
  activeNotebookId: string | 'all' | 'pinned';
  activeNoteId: string | null;
  searchQuery: string;
}
