import { describe, it, expect } from "vitest";
import {
  getWeekStart,
  getWeekDays,
  getISOWeek,
  isToday,
  formatDayHeader,
  formatMonthYear,
  formatDate,
  calculateBookingDuration,
  isValidBookingDateRange
} from "./date-utils";

describe("date-utils", () => {
  describe("getWeekStart", () => {
    it("should return Monday for a date in the middle of the week", () => {
      // Wednesday, March 10, 2021
      const wednesday = new Date(2021, 2, 10); // Month is 0-indexed
      const weekStart = getWeekStart(wednesday);
      
      // Should return Monday, March 8, 2021
      expect(weekStart.getDay()).toBe(1); // Monday = 1
      expect(weekStart.getDate()).toBe(8);
      expect(weekStart.getMonth()).toBe(2); // March
      expect(weekStart.getFullYear()).toBe(2021);
      expect(weekStart.getHours()).toBe(0);
      expect(weekStart.getMinutes()).toBe(0);
      expect(weekStart.getSeconds()).toBe(0);
      expect(weekStart.getMilliseconds()).toBe(0);
    });

    it("should return the same Monday when given a Monday", () => {
      // Monday, March 8, 2021
      const monday = new Date(2021, 2, 8);
      const weekStart = getWeekStart(monday);
      
      expect(weekStart.getDay()).toBe(1); // Monday = 1
      expect(weekStart.getDate()).toBe(8);
      expect(weekStart.getMonth()).toBe(2);
      expect(weekStart.getFullYear()).toBe(2021);
    });

    it("should handle Sunday correctly (return previous Monday)", () => {
      // Sunday, March 14, 2021
      const sunday = new Date(2021, 2, 14);
      const weekStart = getWeekStart(sunday);
      
      // Should return Monday, March 8, 2021
      expect(weekStart.getDay()).toBe(1); // Monday = 1
      expect(weekStart.getDate()).toBe(8);
      expect(weekStart.getMonth()).toBe(2);
      expect(weekStart.getFullYear()).toBe(2021);
    });

    it("should handle month boundaries correctly", () => {
      // Friday, April 2, 2021
      const friday = new Date(2021, 3, 2);
      const weekStart = getWeekStart(friday);
      
      // Should return Monday, March 29, 2021
      expect(weekStart.getDay()).toBe(1); // Monday = 1
      expect(weekStart.getDate()).toBe(29);
      expect(weekStart.getMonth()).toBe(2); // March (previous month)
      expect(weekStart.getFullYear()).toBe(2021);
    });
  });

  describe("getWeekDays", () => {
    it("should return 7 consecutive days starting from Monday", () => {
      // Monday, March 8, 2021
      const monday = new Date(2021, 2, 8);
      const weekDays = getWeekDays(monday);
      
      expect(weekDays).toHaveLength(7);
      
      // Check each day of the week
      expect(weekDays[0].getDay()).toBe(1); // Monday
      expect(weekDays[1].getDay()).toBe(2); // Tuesday
      expect(weekDays[2].getDay()).toBe(3); // Wednesday
      expect(weekDays[3].getDay()).toBe(4); // Thursday
      expect(weekDays[4].getDay()).toBe(5); // Friday
      expect(weekDays[5].getDay()).toBe(6); // Saturday
      expect(weekDays[6].getDay()).toBe(0); // Sunday
      
      // Check consecutive dates
      expect(weekDays[0].getDate()).toBe(8);
      expect(weekDays[1].getDate()).toBe(9);
      expect(weekDays[2].getDate()).toBe(10);
      expect(weekDays[3].getDate()).toBe(11);
      expect(weekDays[4].getDate()).toBe(12);
      expect(weekDays[5].getDate()).toBe(13);
      expect(weekDays[6].getDate()).toBe(14);
    });

    it("should handle month boundaries correctly", () => {
      // Monday, March 29, 2021
      const monday = new Date(2021, 2, 29);
      const weekDays = getWeekDays(monday);
      
      expect(weekDays).toHaveLength(7);
      
      // Week spans March and April
      expect(weekDays[0].getDate()).toBe(29); // March 29
      expect(weekDays[0].getMonth()).toBe(2); // March
      expect(weekDays[1].getDate()).toBe(30); // March 30
      expect(weekDays[1].getMonth()).toBe(2); // March
      expect(weekDays[2].getDate()).toBe(31); // March 31
      expect(weekDays[2].getMonth()).toBe(2); // March
      expect(weekDays[3].getDate()).toBe(1); // April 1
      expect(weekDays[3].getMonth()).toBe(3); // April
    });
  });

  describe("getISOWeek", () => {
    it("should return correct ISO week number", () => {
      // January 4, 2021 (Monday) - Should be week 1
      const jan4 = new Date(2021, 0, 4);
      expect(getISOWeek(jan4)).toBe(1);
      
      // December 28, 2020 (Monday) - Should be week 53 of 2020
      const dec28 = new Date(2020, 11, 28);
      expect(getISOWeek(dec28)).toBe(53);
      
      // March 8, 2021 (Monday) - Should be week 10
      const mar8 = new Date(2021, 2, 8);
      expect(getISOWeek(mar8)).toBe(10);
    });

    it("should handle year boundaries correctly", () => {
      // January 1, 2021 (Friday) - Should be week 53 of 2020
      const jan1 = new Date(2021, 0, 1);
      expect(getISOWeek(jan1)).toBe(53);
      
      // January 4, 2021 (Monday) - Should be week 1 of 2021
      const jan4 = new Date(2021, 0, 4);
      expect(getISOWeek(jan4)).toBe(1);
    });
  });

  describe("isToday", () => {
    it("should return true for today's date", () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it("should return true for a different time on the same day", () => {
      const today = new Date();
      const todayDifferentTime = new Date(today);
      todayDifferentTime.setHours(23, 59, 59, 999);
      expect(isToday(todayDifferentTime)).toBe(true);
    });

    it("should return false for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it("should return false for tomorrow", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe("formatDayHeader", () => {
    it("should format day headers correctly", () => {
      const monday = new Date(2021, 2, 8); // Monday
      const tuesday = new Date(2021, 2, 9); // Tuesday
      const wednesday = new Date(2021, 2, 10); // Wednesday
      const thursday = new Date(2021, 2, 11); // Thursday
      const friday = new Date(2021, 2, 12); // Friday
      const saturday = new Date(2021, 2, 13); // Saturday
      const sunday = new Date(2021, 2, 14); // Sunday
      
      expect(formatDayHeader(monday)).toBe("Mon");
      expect(formatDayHeader(tuesday)).toBe("Tue");
      expect(formatDayHeader(wednesday)).toBe("Wed");
      expect(formatDayHeader(thursday)).toBe("Thu");
      expect(formatDayHeader(friday)).toBe("Fri");
      expect(formatDayHeader(saturday)).toBe("Sat");
      expect(formatDayHeader(sunday)).toBe("Sun");
    });
  });

  describe("formatMonthYear", () => {
    it("should format month and year correctly", () => {
      const jan2021 = new Date(2021, 0, 15); // January 2021
      const mar2021 = new Date(2021, 2, 10); // March 2021
      const dec2022 = new Date(2022, 11, 25); // December 2022
      
      expect(formatMonthYear(jan2021)).toBe("January 2021");
      expect(formatMonthYear(mar2021)).toBe("March 2021");
      expect(formatMonthYear(dec2022)).toBe("December 2022");
    });
  });

  describe("formatDate", () => {
    it("should format dates for display using short format", () => {
      const mar10 = new Date(2021, 2, 10); // March 10, 2021 (Wednesday)
      const jan1 = new Date(2021, 0, 1); // January 1, 2021 (Friday)
      const dec31 = new Date(2021, 11, 31); // December 31, 2021 (Friday)
      
      expect(formatDate(mar10)).toBe("Wed, Mar 10");
      expect(formatDate(jan1)).toBe("Fri, Jan 1");
      expect(formatDate(dec31)).toBe("Fri, Dec 31");
    });
  });

  describe("calculateBookingDuration", () => {
    it("should calculate duration correctly for same-day pickup and return", () => {
      const pickup = "2021-03-10";
      const returnDate = "2021-03-10";
      
      // Same day = 0 rental days (pickup and return on same day)
      expect(calculateBookingDuration(pickup, returnDate)).toBe(0);
    });

    it("should calculate duration correctly for one rental day", () => {
      const pickup = "2021-03-10"; // Monday pickup
      const returnDate = "2021-03-11"; // Tuesday return
      
      // Monday pickup → Tuesday return = 1 rental day
      expect(calculateBookingDuration(pickup, returnDate)).toBe(1);
    });

    it("should calculate duration correctly for multi-day booking", () => {
      const pickup = "2021-03-10"; // March 10
      const returnDate = "2021-03-13"; // March 13
      
      // 3 rental days (10→11, 11→12, 12→13)
      expect(calculateBookingDuration(pickup, returnDate)).toBe(3);
    });

    it("should handle month boundaries correctly", () => {
      const pickup = "2021-03-30"; // March 30
      const returnDate = "2021-04-02"; // April 2
      
      // 3 rental days (30→31, 31→01, 01→02)
      expect(calculateBookingDuration(pickup, returnDate)).toBe(3);
    });

    it("should handle year boundaries correctly", () => {
      const pickup = "2021-12-30"; // December 30, 2021
      const returnDate = "2022-01-02"; // January 2, 2022
      
      // 3 rental days (30→31, 31→01, 01→02)
      expect(calculateBookingDuration(pickup, returnDate)).toBe(3);
    });

    it("should handle longer durations correctly", () => {
      const pickup = "2021-03-01"; // March 1
      const returnDate = "2021-03-15"; // March 15
      
      // 14 rental days
      expect(calculateBookingDuration(pickup, returnDate)).toBe(14);
    });
  });

  describe("isValidBookingDateRange", () => {
    it("should return true for valid booking dates (return after pickup)", () => {
      const pickup = "2021-03-10";
      const returnDate = "2021-03-11";
      
      expect(isValidBookingDateRange(pickup, returnDate)).toBe(true);
    });

    it("should return false for same-day pickup and return", () => {
      const pickup = "2021-03-10";
      const returnDate = "2021-03-10";
      
      expect(isValidBookingDateRange(pickup, returnDate)).toBe(false);
    });

    it("should return false for return before pickup", () => {
      const pickup = "2021-03-11";
      const returnDate = "2021-03-10";
      
      expect(isValidBookingDateRange(pickup, returnDate)).toBe(false);
    });

    it("should handle month boundaries correctly", () => {
      const pickup = "2021-03-31";
      const returnDate = "2021-04-01";
      
      expect(isValidBookingDateRange(pickup, returnDate)).toBe(true);
    });

    it("should handle year boundaries correctly", () => {
      const pickup = "2021-12-31";
      const returnDate = "2022-01-01";
      
      expect(isValidBookingDateRange(pickup, returnDate)).toBe(true);
    });
  });

  describe("Edge cases and timezone handling", () => {
    it("should handle daylight saving time transitions", () => {
      // These tests ensure our local time calculations work correctly
      // even during DST transitions
      const beforeDST = new Date(2021, 2, 13); // March 13, 2021 (Saturday)
      const afterDST = new Date(2021, 2, 15); // March 15, 2021 (Monday)
      
      const weekStartBefore = getWeekStart(beforeDST);
      const weekStartAfter = getWeekStart(afterDST);
      
      // Both dates are in the same week, so should return the same Monday
      expect(weekStartBefore.getDate()).toBe(8); // Monday March 8
      expect(weekStartAfter.getDate()).toBe(15); // Monday March 15 (different week)
      expect(weekStartBefore.getMonth()).toBe(weekStartAfter.getMonth()); // Both March
    });

    it("should maintain consistency between local date formatting and date calculations", () => {
      const testDate = new Date(2021, 2, 10);
      const weekStart = getWeekStart(testDate);
      const weekDays = getWeekDays(weekStart);
      
      // Test the local date formatting used in the Calendar component
      weekDays.forEach(day => {
        const localFormatted = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        // Should always be in YYYY-MM-DD format
        expect(localFormatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        
        // Year should be consistent
        expect(localFormatted.substring(0, 4)).toBe(day.getFullYear().toString());
      });
    });
  });
});
