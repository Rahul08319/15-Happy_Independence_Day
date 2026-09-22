/**
 * Logic for calculating automatic rolling Independence Day milestones,
 * target countdown dates, anniversaries, and celebratory status for any year.
 */

export interface IndependenceDayInfo {
  targetISO: string;
  targetYear: number;
  yearsCompleted: number;
  editionNumber: number;
  ordinalEdition: string;
  isTodayIndependenceDay: boolean;
  celebrationTitle: string;
  heroBadgeText: string;
}

/**
 * Returns ordinal string for a number (e.g., 78 -> "78th", 81 -> "81st", 82 -> "82nd", 83 -> "83rd")
 */
export const getOrdinal = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Calculate dynamic Independence Day information for any year automatically.
 * India gained independence on August 15, 1947.
 */
export const getIndependenceDayInfo = (fromDate: Date = new Date()): IndependenceDayInfo => {
  const currentYear = fromDate.getFullYear();

  // Define start and end of this year's Independence Day in local time
  const thisYearStart = new Date(currentYear, 7, 15, 0, 0, 0, 0); // August is month index 7
  const thisYearEnd = new Date(currentYear, 7, 15, 23, 59, 59, 999);

  const isToday = fromDate >= thisYearStart && fromDate <= thisYearEnd;

  let targetYear: number;
  if (isToday) {
    targetYear = currentYear;
  } else if (fromDate < thisYearStart) {
    targetYear = currentYear;
  } else {
    // Already past August 15 this year -> roll to next year automatically
    targetYear = currentYear + 1;
  }

  // Format ISO string for countdown target (August 15, 00:00:00)
  const pad = (num: number) => String(num).padStart(2, "0");
  const targetISO = `${targetYear}-08-15T00:00:00`;

  // Independence was in 1947
  const yearsCompleted = targetYear - 1947;
  const editionNumber = yearsCompleted + 1; // e.g. 1947 was 1st, 2024 was 78th, 2025 was 79th, 2026 is 80th
  const ordinalEdition = getOrdinal(editionNumber);

  const celebrationTitle = `Happy ${ordinalEdition} Independence Day`;
  const heroBadgeText = `Honoring ${yearsCompleted} Glorious Years of Freedom (${1947}–${targetYear})`;

  return {
    targetISO,
    targetYear,
    yearsCompleted,
    editionNumber,
    ordinalEdition,
    isTodayIndependenceDay: isToday,
    celebrationTitle,
    heroBadgeText,
  };
};
