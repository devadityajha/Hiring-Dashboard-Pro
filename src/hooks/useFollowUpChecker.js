export function useFollowUpChecker(recruiter) {
  const daysSince = (isoDate) =>
    Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000);

  const lastInteraction = recruiter.interactions?.at(-1);

  const needsFollowUp =
    recruiter.status === "Mailed" &&
    daysSince(recruiter.dateContacted) >= 3 &&
    recruiter.followUpCount === 0;

  const needsSecondFollowUp =
    recruiter.status === "Follow-Up" &&
    lastInteraction &&
    daysSince(lastInteraction.date) >= 5 &&
    recruiter.followUpCount >= 1;

  return { needsFollowUp, needsSecondFollowUp };
}
