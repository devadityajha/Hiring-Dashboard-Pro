import { FileText } from "lucide-react";
import { useDraftStore } from "../store/useDraftStore";
import DraftVault from "../components/drafts/DraftVault";

export default function Drafts() {
  const { drafts } = useDraftStore();

  return (
    <div className="space-y-5">
      {/* ── Header ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2">
          <FileText size={17} className="text-accent" />
          <h2 className="page-title">Draft Vault</h2>
        </div>
        <p className="page-subtitle">
          {drafts.length} saved template{drafts.length !== 1 ? "s" : ""}
          {" · "}Cold emails, LinkedIn, follow-ups, and introductions
        </p>
      </div>

      <DraftVault />
    </div>
  );
}
