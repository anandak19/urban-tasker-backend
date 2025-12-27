import { WeekDayKeys } from '@modules/availability/constants/week-days.constant';

export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// checks if the end time is less than that of the start time (invalid)
// times are in minuts here
export const isInvalidTimes = (start: number, end: number): boolean => {
  return end <= start;
};

// convert to hh:mm format
export const toTimeString = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const getDayFromDate = (date: Date | string): WeekDayKeys => {
  const d = new Date(date);
  return d
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as WeekDayKeys;
};
