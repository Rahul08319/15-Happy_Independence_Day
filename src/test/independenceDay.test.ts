import { describe, it, expect } from "vitest";
import { getIndependenceDayInfo, getOrdinal } from "../lib/independenceDay";

describe("independenceDay logic", () => {
  it("computes correct ordinals", () => {
    expect(getOrdinal(1)).toBe("1st");
    expect(getOrdinal(2)).toBe("2nd");
    expect(getOrdinal(3)).toBe("3rd");
    expect(getOrdinal(4)).toBe("4th");
    expect(getOrdinal(11)).toBe("11th");
    expect(getOrdinal(12)).toBe("12th");
    expect(getOrdinal(13)).toBe("13th");
    expect(getOrdinal(78)).toBe("78th");
    expect(getOrdinal(79)).toBe("79th");
    expect(getOrdinal(80)).toBe("80th");
    expect(getOrdinal(81)).toBe("81st");
    expect(getOrdinal(82)).toBe("82nd");
    expect(getOrdinal(83)).toBe("83rd");
  });

  it("targets current year if before August 15", () => {
    const date = new Date(2027, 2, 10); // March 10, 2027
    const info = getIndependenceDayInfo(date);
    expect(info.targetYear).toBe(2027);
    expect(info.targetISO).toBe("2027-08-15T00:00:00");
    expect(info.yearsCompleted).toBe(80);
    expect(info.editionNumber).toBe(81);
    expect(info.ordinalEdition).toBe("81st");
    expect(info.isTodayIndependenceDay).toBe(false);
  });

  it("identifies August 15 as active celebration day", () => {
    const date = new Date(2026, 7, 15, 14, 30, 0); // August 15, 2026 2:30 PM
    const info = getIndependenceDayInfo(date);
    expect(info.targetYear).toBe(2026);
    expect(info.isTodayIndependenceDay).toBe(true);
    expect(info.yearsCompleted).toBe(79);
    expect(info.ordinalEdition).toBe("80th");
  });

  it("automatically rolls forward to next year if past August 15", () => {
    const date = new Date(2026, 8, 22); // September 22, 2026
    const info = getIndependenceDayInfo(date);
    expect(info.targetYear).toBe(2027);
    expect(info.targetISO).toBe("2027-08-15T00:00:00");
    expect(info.yearsCompleted).toBe(80);
    expect(info.editionNumber).toBe(81);
    expect(info.ordinalEdition).toBe("81st");
    expect(info.celebrationTitle).toBe("Happy 81st Independence Day");
  });

  it("handles the 2047 Indian Independence Centenary correctly", () => {
    const date = new Date(2047, 5, 1); // June 1, 2047
    const info = getIndependenceDayInfo(date);
    expect(info.targetYear).toBe(2047);
    expect(info.yearsCompleted).toBe(100);
    expect(info.editionNumber).toBe(101);
    expect(info.ordinalEdition).toBe("101st");
    expect(info.heroBadgeText).toContain("100 Glorious Years of Freedom");
  });
});
