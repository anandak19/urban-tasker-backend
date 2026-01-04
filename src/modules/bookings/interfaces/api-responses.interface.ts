import { PaginatedResult } from '@shared/interfaces/query.interface';
import { IListTaskersBooking, IListUsersBooking } from './bookings.interface';

export type IFindAllBookingsResponse = PaginatedResult<
  IListTaskersBooking | IListUsersBooking
>;
