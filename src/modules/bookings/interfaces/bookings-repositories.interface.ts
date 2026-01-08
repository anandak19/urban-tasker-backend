import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { BookingDocument } from '../schemas/booking.schema';
import {
  IBookingDetailsRepoResult,
  ICreateBooking,
  IListTaskersBooking,
  IListUsersBooking,
} from './bookings.interface';
import { IBaseRepository } from '@shared/interfaces/base-repository.interface';

export interface IBookingRepository
  extends IBaseRepository<BookingDocument, ICreateBooking> {
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

  getBookingDetailsById(
    bookingId: string,
  ): Promise<IBookingDetailsRepoResult | null>;
}
