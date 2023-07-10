export type Frequency = "daily" | "weekly" | "monthly" | "yearly"

export enum Weekday {
  sunday = 1,
  monday = 2,
  tuesday = 3,
  wednesday = 4,
  thursday = 5,
  friday = 6,
  saturday = 7
}

export interface DayOfWeek {
  dayOfTheWeek: Weekday
  weekNumber: number
}

export interface End {
  endDate?: Date
  occurrenceCount?: number
}

export interface RecurrenceRule {

  frequency: Frequency

  recurrenceEnd?: End

  interval: number

  // / Values of 1 to 7 correspond to Sunday through Saturday. A value of 0 indicates that this property is not set for the recurrence rule.
  firstDayOfTheWeek: number // 何曜日
  // / This property value is valid only for recurrence rules that were initialized with specific days of the week and a frequency type of Weekly, Monthly, or Yearly.
  daysOfTheWeek?: DayOfWeek[] | undefined // 第何週
  // / Values can be from 1 to 31 and from -1 to -31.
  daysOfTheMonth?: number[] | undefined // 月の何日目
  // / Values can be from 1 to 366 and from -1 to -366.
  daysOfTheYear?: number[] | undefined // 年の何日目
  // / Values can be from 1 to 53 and from -1 to -53.
  weeksOfTheYear?: number[] | undefined // 年の何週目
  // / Values can be from 1 to 12.
  monthsOfTheYear?: number[] | undefined // 年の何ヶ月目
}
