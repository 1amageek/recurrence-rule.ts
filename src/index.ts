import { Frequency, Weekday, DayOfWeek, End, RecurrenceRule } from "./RecurrenceRule"
import { contains as containsDateTime } from "./Calendar"
import { DateTime } from "luxon"

export { RecurrenceRule, Frequency, Weekday, DayOfWeek, End }

export { containsDateTime }

export function containsDate(date: Date, recurrenceRules: RecurrenceRule[], occurrenceDate: Date): boolean {
  const dateTime = DateTime.fromJSDate(date)
  let occurrenceDateTime = DateTime.fromJSDate(occurrenceDate)
  return containsDateTime(dateTime, recurrenceRules, occurrenceDateTime)
}
