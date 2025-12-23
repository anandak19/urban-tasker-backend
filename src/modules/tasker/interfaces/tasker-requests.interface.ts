import { WeekDayKeys } from '@modules/availability/constants/week-days.constant';

export interface IAvailTaskerQuery {
  city: string;

  date: string;

  day: WeekDayKeys;

  time: string;

  subcategoryId: string;

  latitude: number;

  longitude: number;
}
