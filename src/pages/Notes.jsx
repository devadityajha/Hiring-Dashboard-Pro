import { StickyNote, PlusCircle, Pin } from "lucide-react";
import { useState } from "react";
import { useNoteStore } from "../store/useNoteStore";
import NoteList from "../components/notes/NoteList";
import NoteForm from "../components/notes/NoteForm";

export default function Notes() {
  const { notes, getPinnedNotes } = useNoteStore();
  const [formOpen, setFormOpen] = useState(false);
  const pinned = getPinnedNotes().length;

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <StickyNote size={17} className="text-accent" />
            <h2 className="page-title">Notes</h2>
          </div>
          <p className="page-subtitle">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
            {pinned > 0 && (
              <span
                className="inline-flex items-center gap-1 ml-2
                               text-accent text-2xs bg-accent/10 px-2 py-0.5 rounded-full"
              >
                <Pin size={9} /> {pinned} pinned
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30
                     text-accent text-sm font-medium rounded-xl transition-colors active:scale-95"
        >
          <PlusCircle size={14} />
          New Note
        </button>
      </div>

      {/* ── Note List ──────────────────────────────────── */}
      <NoteList />

      {/* ── Global Add Modal ───────────────────────────── */}
      {formOpen && <NoteForm onClose={() => setFormOpen(false)} />}
    </div>
  );
}
