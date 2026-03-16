// src/store/useRecruiterStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { idbStorage } from "../utils/idbStorage";

const FOLLOW_UP_DAYS = 3;

const buildFollowUpDate = (fromDate = new Date(), days = FOLLOW_UP_DAYS) =>
  new Date(new Date(fromDate).getTime() + days * 86400000).toISOString();

export const useRecruiterStore = create(
  persist(
    (set, get) => ({
      recruiters: [],

      // ── CREATE ──────────────────────────────────────────────
      addRecruiter: (data) => {
        const now = new Date().toISOString();
        const recruiter = {
          id: uuidv4(),
          name: data.name ?? "",
          company: data.company ?? "",
          email: data.email ?? "",
          linkedinUrl: data.linkedinUrl ?? "",
          dateContacted: now,
          status: data.status ?? "Mailed",
          confidence: data.confidence ?? "Warm Lead",
          notes: data.notes ?? "",
          followUpDate: buildFollowUpDate(),
          followUpCount: 0,
          interactions: [
            {
              id: uuidv4(),
              event: "Mail Sent",
              date: now,
              note: data.notes ?? "",
            },
          ],
        };
        set((s) => ({ recruiters: [recruiter, ...s.recruiters] }));
        return recruiter;
      },

      // ── READ ─────────────────────────────────────────────────
      getRecruiterById: (id) =>
        get().recruiters.find((r) => r.id === id) ?? null,

      // ── UPDATE ───────────────────────────────────────────────
      updateRecruiter: (id, updates) =>
        set((s) => ({
          recruiters: s.recruiters.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        })),

      updateStatus: (id, status) => {
        const now = new Date().toISOString();
        set((s) => ({
          recruiters: s.recruiters.map((r) => {
            if (r.id !== id) return r;
            const followUpCount =
              status === "Follow-Up" ? r.followUpCount + 1 : r.followUpCount;
            const followUpDate =
              status === "Follow-Up"
                ? buildFollowUpDate(now, r.followUpCount === 0 ? 3 : 5)
                : r.followUpDate;
            return { ...r, status, followUpCount, followUpDate };
          }),
        }));
      },

      // ── INTERACTION TIMELINE ─────────────────────────────────
      logInteraction: (id, event, note = "") => {
        const entry = {
          id: uuidv4(),
          event,
          date: new Date().toISOString(),
          note,
        };
        set((s) => ({
          recruiters: s.recruiters.map((r) =>
            r.id === id
              ? { ...r, interactions: [...r.interactions, entry] }
              : r,
          ),
        }));
      },

      // ── DELETE ───────────────────────────────────────────────
      deleteRecruiter: (id) =>
        set((s) => ({ recruiters: s.recruiters.filter((r) => r.id !== id) })),

      // ── DUPLICATE DETECTION ──────────────────────────────────
      findDuplicate: ({ email, name, company }) => {
        const recruiters = get().recruiters;
        return (
          recruiters.find(
            (r) =>
              (email && r.email?.toLowerCase() === email.toLowerCase()) ||
              (name &&
                company &&
                r.name?.toLowerCase() === name.toLowerCase() &&
                r.company?.toLowerCase() === company.toLowerCase()),
          ) ?? null
        );
      },

      // ── FOLLOW-UP HELPERS ────────────────────────────────────
      getFollowUpsDue: () => {
        const now = Date.now();
        return get().recruiters.filter(
          (r) =>
            r.followUpDate &&
            new Date(r.followUpDate).getTime() <= now &&
            !["Interviewing", "Closed"].includes(r.status),
        );
      },
    }),
    {
      name: "hiretrack-recruiters",
      storage: idbStorage,
    },
  ),
);
