import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { BookingDocument } from '../schemas/booking.schema';
import { ICreateBooking, IListBooking } from './bookings.interface';

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
  ): Promise<PaginatedResult<IListBooking>>;
}
