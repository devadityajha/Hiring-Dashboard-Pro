import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { X, UserPlus, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRecruiterStore } from "../../store/useRecruiterStore";
import { detectDuplicate } from "../../utils/duplicateDetector";
import DuplicateAlert from "./DuplicateAlert";

const STATUSES = [
  "Mailed",
  "Follow-Up",
  "Interviewing",
  "No Response",
  "Applied",
  "Closed",
];
const CONFIDENCES = ["Hot Lead", "Warm Lead", "Cold Lead"];

const FIELD =
  "w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-xs text-text " +
  "placeholder-muted outline-none focus:border-accent/60 transition-colors";

export default function RecruiterForm({
  onClose,
  editTarget = null,
  quickPrefill = null,
}) {
  const { recruiters, addRecruiter, updateRecruiter } = useRecruiterStore();
  const isEdit = Boolean(editTarget);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: isEdit
      ? {
          name: editTarget.name,
          company: editTarget.company,
          email: editTarget.email,
          linkedinUrl: editTarget.linkedinUrl,
          status: editTarget.status,
          confidence: editTarget.confidence,
          notes: editTarget.notes,
        }
      : {
          status: "Mailed",
          confidence: "Warm Lead",
          email: quickPrefill?.email ?? "",
          linkedinUrl: quickPrefill?.linkedinUrl ?? "",
        },
  });

  // Watched fields for live duplicate detection
  const watchedEmail = watch("email", "");
  const watchedName = watch("name", "");
  const watchedCompany = watch("company", "");

  const [duplicate, setDuplicate] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  // Runs on every keystroke in email / name / company
  useEffect(() => {
    if (dismissed) return;
    const dup = detectDuplicate(
      recruiters,
      { email: watchedEmail, name: watchedName, company: watchedCompany },
      isEdit ? editTarget.id : null,
    );
    setDuplicate(dup ?? null);
  }, [watchedEmail, watchedName, watchedCompany, dismissed]);

  const onSubmit = (data) => {
    if (duplicate && !dismissed) {
      toast.error("Duplicate recruiter detected — review the alert above.");
      return;
    }

    if (isEdit) {
      updateRecruiter(editTarget.id, data);
      toast.success("Recruiter updated ✓");
    } else {
      addRecruiter(data);
      toast.success("Recruiter added ✓");
    }
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl
                      max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <UserPlus size={15} className="text-accent" />
            <h3 className="text-sm font-semibold text-text">
              {isEdit ? "Edit Recruiter" : "Add Recruiter"}
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

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* Duplicate Alert */}
          {duplicate && !dismissed && (
            <DuplicateAlert
              duplicate={duplicate}
              onDismiss={() => setDismissed(true)}
            />
          )}

          {/* Row: Name + Company */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-2xs font-medium text-muted">
                Full Name *
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Jane Smith"
                className={FIELD}
              />
              {errors.name && (
                <p className="text-2xs text-danger">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-medium text-muted">
                Company *
              </label>
              <input
                {...register("company", { required: "Company is required" })}
                placeholder="Google"
                className={FIELD}
              />
              {errors.company && (
                <p className="text-2xs text-danger">{errors.company.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-2xs font-medium text-muted">Email *</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
              placeholder="jane@google.com"
              className={`${FIELD} ${duplicate && !dismissed ? "border-warning/60" : ""}`}
            />
            {errors.email && (
              <p className="text-2xs text-danger">{errors.email.message}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <label className="text-2xs font-medium text-muted flex items-center gap-1.5">
              <Link2 size={10} /> LinkedIn URL
            </label>
            <input
              {...register("linkedinUrl")}
              placeholder="https://linkedin.com/in/janesmith"
              className={FIELD}
            />
          </div>

          {/* Row: Status + Confidence */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-2xs font-medium text-muted">Status</label>
              <select {...register("status")} className={FIELD}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-medium text-muted">
                Confidence
              </label>
              <select {...register("confidence")} className={FIELD}>
                {CONFIDENCES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-2xs font-medium text-muted">Notes</label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Any relevant context about this recruiter..."
              className={`${FIELD} resize-none leading-relaxed`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-accent/20 hover:bg-accent/30 text-accent
                         text-sm font-semibold rounded-xl transition-all duration-150
                         active:scale-[0.98] disabled:opacity-50"
            >
              {isEdit ? "Save Changes" : "Add Recruiter"}
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
