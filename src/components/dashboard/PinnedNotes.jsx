import { Pin, StickyNote, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNoteStore } from "../../store/useNoteStore";

function NoteChip({ note }) {
  return (
    <div
      className="bg-bg/60 border border-border/60 rounded-lg p-3 hover:border-accent/30
                    transition-colors cursor-default"
    >
      <div className="flex items-start gap-2">
        <Pin size={10} className="text-accent flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-text truncate">{note.title}</p>
          <p className="text-2xs text-muted mt-0.5 line-clamp-2 leading-relaxed">
            {note.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PinnedNotes() {
  const navigate = useNavigate();
  const { getPinnedNotes } = useNoteStore();
  const pinned = getPinnedNotes();

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote size={14} className="text-accent" />
          <p className="text-xs font-semibold text-text">Pinned Notes</p>
        </div>
        <button
          onClick={() => navigate("/notes")}
          className="flex items-center gap-0.5 text-2xs text-muted hover:text-accent transition-colors"
        >
          All notes <ChevronRight size={11} />
        </button>
      </div>

      {/* Notes grid */}
      {pinned.length === 0 ? (
        <div className="flex flex-col items-center py-5 gap-2">
          <Pin size={20} className="text-muted/30" />
          <p className="text-2xs text-muted text-center">
            No pinned notes yet.
            <br />
            Pin a note to surface it here.
          </p>
          <button
            onClick={() => navigate("/notes")}
            className="text-2xs text-accent hover:underline mt-1"
          >
            Go to notes →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {pinned.slice(0, 4).map((note) => (
            <NoteChip key={note.id} note={note} />
          ))}
          {pinned.length > 4 && (
            <button
              onClick={() => navigate("/notes")}
              className="text-2xs text-muted hover:text-accent transition-colors text-center py-1"
            >
              +{pinned.length - 4} more pinned notes
            </button>
          )}
        </div>
      )}
    </div>
  );
}
