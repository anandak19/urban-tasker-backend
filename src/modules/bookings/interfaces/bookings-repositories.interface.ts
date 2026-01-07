import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { BookingDocument } from '../schemas/booking.schema';
import {
  ICreateBooking,
  IListTaskersBooking,
  IListUsersBooking,
} from './bookings.interface';

export interface IBookingRepository {
  /**
   * Create a new booking
   */
  createBooking(payload: ICreateBooking): Promise<BookingDocument>;

  /**
   * Fetch all bookings
   */
  getAllBookings(
    userId: string,
    filter: IFindAllQuery,
  ): Promise<PaginatedResult<IListUsersBooking>>;

  getAllTaskerBookings(
    taskerId: string,
    filter: IFindAllQuery,
  ): Promise<PaginatedResult<IListTaskersBooking>>;
}
