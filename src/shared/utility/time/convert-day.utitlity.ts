import {
  WEEK_DAYS,
  WeekDayKeys,
} from '@modules/availability/constants/week-days.constant';

export function getDay(day: number): WeekDayKeys {
  return WEEK_DAYS[day - 1];
}
