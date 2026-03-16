import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, StickyNote } from "lucide-react";
import toast from "react-hot-toast";
import { useNoteStore } from "../../store/useNoteStore";

const FIELD =
  "w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-xs text-text " +
  "placeholder-muted outline-none focus:border-accent/60 transition-colors";

export default function NoteForm({ onClose, editTarget = null }) {
  const { addNote, updateNote } = useNoteStore();
  const isEdit = Boolean(editTarget);

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? { title: editTarget.title, content: editTarget.content }
      : {},
  });

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const contentLength = watch("content")?.length ?? 0;

  const onSubmit = (data) => {
    if (isEdit) {
      updateNote(editTarget.id, data);
      toast.success("Note updated ✓");
    } else {
      addNote(data);
      toast.success("Note saved ✓");
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-black/60 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-lg bg-surface border border-border rounded-2xl
                      shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4
                        border-b border-border flex-shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <StickyNote size={15} className="text-accent" />
            <h3 className="text-sm font-semibold text-text">
              {isEdit ? "Edit Note" : "New Note"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       text-muted hover:text-text hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-6 py-5 overflow-y-auto"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-2xs font-medium text-muted">Title *</label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="e.g. Amazon Interview Prep"
              className={FIELD}
              onKeyDown={(e) => {
                // Jump to content on Enter
                if (e.key === "Enter") {
                  e.preventDefault();
                  setFocus("content");
                }
              }}
            />
            {errors.title && (
              <p className="text-2xs text-danger">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-2xs font-medium text-muted">
                Content *
              </label>
              <span className="text-2xs text-muted">{contentLength} chars</span>
            </div>
            <textarea
              {...register("content", { required: "Content is required" })}
              rows={10}
              placeholder={
                "Write anything relevant to your job search...\n\n" +
                "• Interview prep notes\n" +
                "• Companies to research\n" +
                "• Conversation notes"
              }
              className={`${FIELD} resize-none leading-relaxed`}
            />
            {errors.content && (
              <p className="text-2xs text-danger">{errors.content.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-accent/20 hover:bg-accent/30 text-accent
                         text-sm font-semibold rounded-xl transition-all duration-150
                         active:scale-[0.98]"
            >
              {isEdit ? "Save Changes" : "Save Note"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-muted hover:text-text text-sm
                         rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
