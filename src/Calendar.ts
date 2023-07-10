import { Interval, DateTime } from "luxon"
import { RecurrenceRule, End } from "./RecurrenceRule"

export function contains(date: DateTime, recurrenceRules: RecurrenceRule[], occurrenceDate: DateTime): boolean {
  if (recurrenceRules.length === 0) {
    return false;
  }
  return recurrenceRules.some(rule => containsInRule(date, rule, occurrenceDate));
}

function adjustWeekday(day: number, firstDayOfTheWeek: number): number {
  const offset = firstDayOfTheWeek == 0 ? 1 : firstDayOfTheWeek;
  let adjustedDay = day + offset;
  if (adjustedDay > 7) {
    adjustedDay = adjustedDay % 7;
  }
  return adjustedDay;
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