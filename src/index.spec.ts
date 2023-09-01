import { containsDate as contains, RecurrenceRule, Weekday } from './index';
import { DateTime } from 'luxon'

describe("contains function", () => {
  it("should return true when date is contained in the 'daily' recurrence rule", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "daily",
      interval: 1,
      firstDayOfTheWeek: 1,
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return false when date is not contained in the 'weekly' recurrence rule", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "weekly",
      interval: 1,
      firstDayOfTheWeek: 1,
      daysOfTheWeek: [{ dayOfTheWeek: Weekday.wednesday, weekNumber: 1 }],
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(false);
  });

  it("should return true when date is contained in the 'monthly' recurrence rule", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "monthly",
      interval: 1,
      firstDayOfTheWeek: 2,
      daysOfTheMonth: [10],
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return true when date is contained in the 'yearly' recurrence rule", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();
    const rule: RecurrenceRule = {
      frequency: "yearly",
      interval: 1,
      firstDayOfTheWeek: 2,
      monthsOfTheYear: [7],
      daysOfTheMonth: [10],
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });
});

describe("Additional contains function tests", () => {
  it("should return true when date is out of interval in 'daily' recurrence rule", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 7 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "daily",
      interval: 2, // Interval is 2 days
      firstDayOfTheWeek: 2,
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return true when date is on specific weekday in 'weekly' recurrence rule", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 9 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "weekly",
      interval: 1,
      firstDayOfTheWeek: 2,
      daysOfTheWeek: [{ dayOfTheWeek: Weekday.sunday, weekNumber: 2 }], // Change weekNumber to 2
    };    
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return false when date is not on the specific day of the month in 'monthly' recurrence rule", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "monthly",
      interval: 1,
      firstDayOfTheWeek: 2,
      daysOfTheMonth: [12], // 12th of the month
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(false);
  });

  it("should return false when date is not in the specific month in 'yearly' recurrence rule", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "yearly",
      interval: 1,
      firstDayOfTheWeek: 2,
      monthsOfTheYear: [1], // January
      daysOfTheMonth: [10],
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(false);
  });
});

describe("Edge case contains function tests", () => {
  it("should return false when 'weekly' recurrence rule is set but date is not on the specified weekday", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 8 }).toJSDate(); // 8th July 2023 is Saturday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "weekly",
      interval: 1,
      firstDayOfTheWeek: 2,
      daysOfTheWeek: [{ dayOfTheWeek: Weekday.friday, weekNumber: 2 }],
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(false);
  });

  it("should return false when 'monthly' recurrence rule is set but date is not on the specified day of the month", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 11 }).toJSDate(); // 11th July 2023
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "monthly",
      interval: 1,
      firstDayOfTheWeek: 2,
      daysOfTheMonth: [10], // 10th of the month
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(false);
  });

  it("should return true when 'yearly' recurrence rule is set and date is in the specified month and day", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 10th July 2023
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "yearly",
      interval: 1,
      firstDayOfTheWeek: 2,
      monthsOfTheYear: [7], // July
      daysOfTheMonth: [10], // 10th of the month
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return false when 'yearly' recurrence rule is set but date is not on the specified month", () => {
    const date = DateTime.fromObject({ year: 2023, month: 8, day: 10 }).toJSDate(); // 10th August 2023
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 1 }).toJSDate();

    const rule: RecurrenceRule = {
      frequency: "yearly",
      interval: 1,
      firstDayOfTheWeek: 2,
      monthsOfTheYear: [7], // July
      daysOfTheMonth: [10], // 10th of the month
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(false);
  });
});

describe("Extra edge case contains function tests", () => {
  it("should return true when 'daily' recurrence rule is set, the interval is more than 1, and the date is in the interval", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 9 }).toJSDate(); // 9th July 2023 is Sunday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 7 }).toJSDate(); // 7th July 2023 is Friday

    const rule: RecurrenceRule = {
      frequency: "daily",
      interval: 2,
      firstDayOfTheWeek: 2, // First day is Sunday
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return false when 'weekly' recurrence rule is set, the interval is more than 1, and the date is not in the interval", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 14 }).toJSDate(); // 14th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 7 }).toJSDate(); // 7th July 2023 is Friday

    const rule: RecurrenceRule = {
      frequency: "weekly",
      interval: 2, // interval is 2 weeks
      firstDayOfTheWeek: 2, // First day is Monday
      daysOfTheWeek: [{ dayOfTheWeek: Weekday.friday, weekNumber: 2 }],
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(false);
  });

  it("should return true when 'monthly' recurrence rule is set, the interval is more than 1, and the date is in the interval", () => {
    const date = DateTime.fromObject({ year: 2023, month: 9, day: 10 }).toJSDate(); // 10th September 2023
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 10th July 2023

    const rule: RecurrenceRule = {
      frequency: "monthly",
      interval: 2, // Interval is 2 months
      firstDayOfTheWeek: 2,
      daysOfTheMonth: [10], // 10th of the month
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return false when 'yearly' recurrence rule is set, the interval is more than 1, and the date is not in the interval", () => {
    const date = DateTime.fromObject({ year: 2024, month: 7, day: 10 }).toJSDate(); // 10th July 2024
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 10th July 2023

    const rule: RecurrenceRule = {
      frequency: "yearly",
      interval: 2, // Interval is 2 years
      firstDayOfTheWeek: 2,
      monthsOfTheYear: [7], // July
      daysOfTheMonth: [10], // 10th of the month
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(false);
  });
});

describe("Extra extra edge case contains function tests", () => {
  it("should return true when 'daily' recurrence rule is set, the interval is more than 1, and the date is the same day as the occurrenceDate", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 7 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 7 }).toJSDate(); // 7th July 2023 is Friday

    const rule: RecurrenceRule = {
      frequency: "daily",
      interval: 2,
      firstDayOfTheWeek: 2, // First day is Sunday
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return true when 'weekly' recurrence rule is set, the interval is more than 1, and the date is the same day as the occurrenceDate", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 2 }).toJSDate(); // 7th July 2023 is Friday
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 2 }).toJSDate(); // 7th July 2023 is Friday

    const rule: RecurrenceRule = {
      frequency: "weekly",
      interval: 2, // interval is 2 weeks
      firstDayOfTheWeek: 1, // First day is Monday
      daysOfTheWeek: [{ dayOfTheWeek: Weekday.sunday, weekNumber: 2 }],
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return true when 'monthly' recurrence rule is set, the interval is more than 1, and the date is the same day as the occurrenceDate", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 10th July 2023
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 10th July 2023

    const rule: RecurrenceRule = {
      frequency: "monthly",
      interval: 2, // Interval is 2 months
      firstDayOfTheWeek: 2,
      daysOfTheMonth: [10], // 10th of the month
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });

  it("should return true when 'yearly' recurrence rule is set, the interval is more than 1, and the date is the same day as the occurrenceDate", () => {
    const date = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 10th July 2023
    const occurrenceDate = DateTime.fromObject({ year: 2023, month: 7, day: 10 }).toJSDate(); // 10th July 2023

    const rule: RecurrenceRule = {
      frequency: "yearly",
      interval: 2, // Interval is 2 years
      firstDayOfTheWeek: 2,
      monthsOfTheYear: [7], // July
      daysOfTheMonth: [10], // 10th of the month
    };
    const recurrenceRules: RecurrenceRule[] = [rule];
    expect(contains(date, recurrenceRules, occurrenceDate)).toBe(true);
  });
});
