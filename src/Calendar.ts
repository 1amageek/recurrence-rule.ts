import { Interval, DateTime } from "luxon"
import { RecurrenceRule, End } from "./RecurrenceRule"

export function contains(date: DateTime, recurrenceRules: RecurrenceRule[], occurrenceDate: DateTime): boolean {
  if (recurrenceRules.length === 0) {
    return false;
  }
  return recurrenceRules.some(rule => containsInRule(date, rule, occurrenceDate));
}

/// Luxon's weekday uses values from 1 to 7 to represent Monday through Sunday.
/// Mon, Tue, Wed, Thu, Fri, Sat, Sun
/// 1, 2, 3, 4, 5, 6, 7
/// Apple's EKRecurrenceRule uses values from 1 to 7 to represent Sunday through Saturday.
/// Sun, Mon, Tue, Wed, Thu, Fri, Sat
/// 1, 2, 3, 4, 5, 6, 7
function adjustWeekday(day: number, firstDayOfTheWeek: number): number {
  if (firstDayOfTheWeek === 0) {
    // If firstDayOfTheWeek is 0, retain Luxon's specification
    return day;
  }

  // Convert the day into Apple's representation
  let appleRepresentation = day === 7 ? 1 : day + 1;

  // Adjust based on the firstDayOfTheWeek
  let offset = (appleRepresentation - firstDayOfTheWeek + 7) % 7;

  return (offset + firstDayOfTheWeek) % 7 || 7; // Convert back to Luxon's 1-based index
}

function containsInRule(date: DateTime, rule: RecurrenceRule, occurrenceDate: DateTime): boolean {
  if (date < occurrenceDate) {
    return false;
  }
  let end = rule.recurrenceEnd;
  let isMatchingCycle = matchesCycle(date, rule, occurrenceDate, end);
  switch (rule.frequency) {
    case "daily":
      return isMatchingCycle;
    case "weekly":
      if (isMatchingCycle) {
        let weekday = adjustWeekday(date.weekday, rule.firstDayOfTheWeek);
        if (rule.daysOfTheWeek) {
          return rule.daysOfTheWeek.some(dayOfWeek => dayOfWeek.dayOfTheWeek === weekday);
        }
        return weekday === occurrenceDate.weekday;
      }
      return false;
    case "monthly":
      if (isMatchingCycle) {
        if (rule.daysOfTheWeek) {
          let weekday = adjustWeekday(date.weekday, rule.firstDayOfTheWeek);
          return rule.daysOfTheWeek.some(dayOfWeek => dayOfWeek.dayOfTheWeek === weekday);
        } else if (rule.daysOfTheMonth) {
          let day = date.day;
          return rule.daysOfTheMonth.includes(day);
        }
        let day = date.day;
        return day === occurrenceDate.day;
      }
      return false;
    case "yearly":
      if (isMatchingCycle) {
        if (rule.monthsOfTheYear) {
          let month = date.month;
          let isMatching = rule.monthsOfTheYear.includes(month);
          if (rule.daysOfTheWeek) {
            let weekday = adjustWeekday(date.weekday, rule.firstDayOfTheWeek);
            return rule.daysOfTheWeek.some(dayOfWeek => dayOfWeek.dayOfTheWeek === weekday) && isMatching;
          } else if (rule.daysOfTheMonth) {
            let day = date.day;
            return rule.daysOfTheMonth.includes(day) && isMatching;
          }
          let day = date.day;
          return day === occurrenceDate.day && isMatching;
        }
      }
      return false;
  }
}

function matchesCycle(date: DateTime, rule: RecurrenceRule, occurrenceDate: DateTime, end: End | undefined): boolean {
  let frequencyDiff: number
  let cycleDiff: number;
  switch (rule.frequency) {
    case "daily":
      frequencyDiff = Math.floor(Interval.fromDateTimes(occurrenceDate, date).length('days'))
      cycleDiff = Math.floor(frequencyDiff / rule.interval);
      break;
    case "weekly":
      frequencyDiff = Math.floor(Interval.fromDateTimes(occurrenceDate, date).length('weeks'))
      cycleDiff = Math.floor(frequencyDiff / rule.interval);
      break;
    case "monthly":
      frequencyDiff = Math.floor(Interval.fromDateTimes(occurrenceDate, date).length('months'))
      cycleDiff = Math.floor(frequencyDiff / rule.interval);
      break;
    case "yearly":
      frequencyDiff = Math.floor(Interval.fromDateTimes(occurrenceDate, date).length('years'))
      cycleDiff = Math.floor(frequencyDiff / rule.interval);
      break;
    default:
      return false;
  }
  if (cycleDiff < 0) {
    return false;
  }
  if (end?.endDate !== undefined && date > DateTime.fromJSDate(end.endDate)) {
    return false;
  }
  return frequencyDiff % rule.interval === 0;
}