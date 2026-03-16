import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useDraftStore, DRAFT_CATEGORIES } from "../../store/useDraftStore";

const FIELD =
  "w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-xs text-text " +
  "placeholder-muted outline-none focus:border-accent/60 transition-colors";

const CATEGORY_COLORS = {
  "Cold Email": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  LinkedIn: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Follow-Up": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Introduction: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function DraftForm({ onClose, editTarget = null }) {
  const { addDraft, updateDraft } = useDraftStore();
  const isEdit = Boolean(editTarget);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? {
          title: editTarget.title,
          category: editTarget.category,
          content: editTarget.content,
        }
      : { category: "Cold Email" },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const onSubmit = (data) => {
    if (isEdit) {
      updateDraft(editTarget.id, data);
      toast.success("Draft updated ✓");
    } else {
      addDraft(data);
      toast.success("Draft saved ✓");
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-black/60 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-xl bg-surface border border-border rounded-2xl
                      shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4
                        border-b border-border flex-shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <FileText size={15} className="text-accent" />
            <h3 className="text-sm font-semibold text-text">
              {isEdit ? "Edit Draft" : "New Draft"}
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
              placeholder="e.g. Cold Email — SDE2 Roles"
              className={FIELD}
            />
            {errors.title && (
              <p className="text-2xs text-danger">{errors.title.message}</p>
            )}
          </div>

          {/* Category pills */}
          <div className="space-y-2">
            <label className="text-2xs font-medium text-muted">Category</label>
            <div className="flex flex-wrap gap-2">
              {DRAFT_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                const colors =
                  CATEGORY_COLORS[cat] ?? "bg-white/5 text-muted border-border";
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setValue("category", cat)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium
                                transition-all duration-150
                                ${
                                  active
                                    ? colors
                                    : "bg-bg text-muted border-border hover:border-border/80"
                                }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            {/* Hidden for react-hook-form registration */}
            <input type="hidden" {...register("category")} />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-2xs font-medium text-muted">
                Message Content *
              </label>
              <span className="text-2xs text-muted">
                {watch("content")?.length ?? 0} chars
              </span>
            </div>
            <textarea
              {...register("content", { required: "Content is required" })}
              rows={11}
              placeholder={
                "Hi [Name],\n\nI came across your profile on LinkedIn and wanted to reach out...\n\nBest,\n[Your Name]"
              }
              className={`${FIELD} resize-none leading-relaxed font-mono`}
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
              {isEdit ? "Save Changes" : "Save Draft"}
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
