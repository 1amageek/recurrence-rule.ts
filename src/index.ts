import { Frequency, Weekday, DayOfWeek, End, RecurrenceRule } from "./RecurrenceRule"
import { contains as CalendarContains } from "./Calendar"
import { DateTime } from "luxon"

export { RecurrenceRule, Frequency, Weekday, DayOfWeek, End }

export function contains(date: Date, recurrenceRules: RecurrenceRule[], occurrenceDate: Date): boolean {
  const dateTime = DateTime.fromJSDate(date)
  let occurrenceDateTime = DateTime.fromJSDate(occurrenceDate)
  return CalendarContains(dateTime, recurrenceRules, occurrenceDateTime)
}