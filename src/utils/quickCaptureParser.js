const LINKEDIN_RE = /linkedin\.com\/in\/[\w-]+/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\//i;

/**
 * Returns { type, value, meta }
 * type: "linkedin" | "email" | "url" | "note"
 */
export function parseQuickCapture(raw) {
  const value = raw.trim();
  if (!value) return null;

  if (LINKEDIN_RE.test(value)) {
    // Extract handle for display
    const match = value.match(/linkedin\.com\/in\/([\w-]+)/i);
    return {
      type: "linkedin",
      value,
      meta: { handle: match?.[1] ?? value },
    };
  }

  if (EMAIL_RE.test(value)) {
    return {
      type: "email",
      value,
      meta: { domain: value.split("@")[1] },
    };
  }

  if (URL_RE.test(value)) {
    return {
      type: "url",
      value,
      meta: { host: new URL(value).hostname },
    };
  }

  return {
    type: "note",
    value,
    meta: { wordCount: value.split(/\s+/).length },
  };
}
