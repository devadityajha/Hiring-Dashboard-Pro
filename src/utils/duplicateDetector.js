/**
 * Returns the first recruiter that matches on email OR (name + company).
 * Pass an optional `excludeId` when editing to avoid self-matching.
 */
export function detectDuplicate(
  recruiters,
  { email, name, company },
  excludeId = null,
) {
  const norm = (s) => s?.trim().toLowerCase() ?? "";

  return (
    recruiters.find((r) => {
      if (excludeId && r.id === excludeId) return false;

      const emailMatch =
        email && norm(r.email) && norm(r.email) === norm(email);

      const nameCompanyMatch =
        name &&
        company &&
        norm(r.name) === norm(name) &&
        norm(r.company) === norm(company);

      return emailMatch || nameCompanyMatch;
    }) ?? null
  );
}
