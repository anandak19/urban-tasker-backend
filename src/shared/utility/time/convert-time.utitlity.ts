import { WeekDayKeys } from '@modules/availability/constants/week-days.constant';

export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const isInvalidTimes = (start: string, end: string): boolean => {
  return timeToMinutes(end) <= timeToMinutes(start);
};

export const getDayFromDate = (date: Date | string): WeekDayKeys => {
  const d = new Date(date);
  return d
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as WeekDayKeys;
};
