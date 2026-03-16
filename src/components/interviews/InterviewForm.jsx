import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, CalendarCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  useInterviewStore,
  INTERVIEW_TYPES,
} from "../../store/useInterviewStore";
import { useRecruiterStore } from "../../store/useRecruiterStore";

const FIELD =
  "w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-xs text-text " +
  "placeholder-muted outline-none focus:border-accent/60 transition-colors";

// Build datetime-local default = now + 1 day rounded to next half-hour
function defaultDateTime() {
  const d = new Date(Date.now() + 86400000);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 0);
  if (d.getMinutes() === 0) d.setHours(d.getHours() + 1);
  // Format: "YYYY-MM-DDTHH:MM"
  return d.toISOString().slice(0, 16);
}

export default function InterviewForm({
  onClose,
  editTarget = null,
  prefillRecruiterId = null,
}) {
  const { addInterview, updateInterview } = useInterviewStore();
  const { recruiters } = useRecruiterStore();
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
          company: editTarget.company,
          recruiterName: editTarget.recruiterName,
          recruiterId: editTarget.recruiterId ?? "",
          date: editTarget.date
            ? new Date(editTarget.date).toISOString().slice(0, 16)
            : defaultDateTime(),
          type: editTarget.type,
          notes: editTarget.notes,
          reminderSet: editTarget.reminderSet,
        }
      : {
          date: defaultDateTime(),
          type: "HR",
          reminderSet: true,
          recruiterId: prefillRecruiterId ?? "",
        },
  });

  useEffect(() => {
    setFocus("company");
  }, [setFocus]);

  // Auto-fill company + recruiter name when recruiter selected from dropdown
  const selectedRecruiterId = watch("recruiterId");
  useEffect(() => {
    if (!selectedRecruiterId) return;
    const r = recruiters.find((r) => r.id === selectedRecruiterId);
    if (!r) return;
    setValue("company", r.company);
    setValue("recruiterName", r.name);
  }, [selectedRecruiterId, recruiters, setValue]);

  const onSubmit = (data) => {
    const isoDate = new Date(data.date).toISOString();
    // Reminder = 1 hour before interview
    const reminderTime = new Date(
      new Date(data.date).getTime() - 3600000,
    ).toISOString();

    const payload = {
      ...data,
      date: isoDate,
      reminderTime: data.reminderSet ? reminderTime : null,
    };

    if (isEdit) {
      updateInterview(editTarget.id, payload);
      toast.success("Interview updated ✓");
    } else {
      addInterview(payload);
      toast.success("Interview scheduled ✓");
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
            <CalendarCheck size={15} className="text-accent" />
            <h3 className="text-sm font-semibold text-text">
              {isEdit ? "Edit Interview" : "Schedule Interview"}
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
          {/* Link to recruiter (optional) */}
          {recruiters.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-2xs font-medium text-muted">
                Link to Recruiter
                <span className="ml-1 text-muted/60">
                  (optional — auto-fills below)
                </span>
              </label>
              <select {...register("recruiterId")} className={FIELD}>
                <option value="">— Select a recruiter —</option>
                {recruiters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} @ {r.company}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Row: Company + Recruiter Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-2xs font-medium text-muted">
                Company *
              </label>
              <input
                {...register("company", { required: "Company is required" })}
                placeholder="Razorpay"
                className={FIELD}
              />
              {errors.company && (
                <p className="text-2xs text-danger">{errors.company.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-medium text-muted">
                Recruiter Name
              </label>
              <input
                {...register("recruiterName")}
                placeholder="Rohan Mehta"
                className={FIELD}
              />
            </div>
          </div>

          {/* Row: Date + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-2xs font-medium text-muted">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register("date", { required: "Date is required" })}
                className={`${FIELD} [color-scheme:dark]`}
              />
              {errors.date && (
                <p className="text-2xs text-danger">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-medium text-muted">
                Interview Type
              </label>
              <select {...register("type")} className={FIELD}>
                {INTERVIEW_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-2xs font-medium text-muted">
              Preparation Notes
            </label>
            <textarea
              {...register("notes")}
              rows={4}
              placeholder={
                "Topics to revise:\n• Node.js event loop\n• System design basics\n• Past project walkthrough"
              }
              className={`${FIELD} resize-none leading-relaxed`}
            />
          </div>

          {/* Reminder toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                {...register("reminderSet")}
                className="sr-only peer"
              />
              <div
                className="w-9 h-5 bg-border rounded-full
                              peer-checked:bg-accent/70 transition-colors"
              />
              <div
                className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full
                              shadow transition-transform
                              peer-checked:translate-x-4"
              />
            </div>
            <div>
              <p className="text-xs font-medium text-text">
                Remind me 1 hour before
              </p>
              <p className="text-2xs text-muted">
                In-app notification when the browser tab is open
              </p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-accent/20 hover:bg-accent/30 text-accent
                         text-sm font-semibold rounded-xl transition-all duration-150
                         active:scale-[0.98]"
            >
              {isEdit ? "Save Changes" : "Schedule Interview"}
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
