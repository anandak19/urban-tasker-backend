import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { BookingDocument } from '../schemas/booking.schema';
import {
  IBookingDetailsRepoResult,
  IBookingMatchArgs,
  ICreateBooking,
  IListTaskersBooking,
} from './bookings.interface';
import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { IListBookingsQuery } from './request.interface';

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
    matchArgs: IBookingMatchArgs,
    filter: IListBookingsQuery,
  ): Promise<PaginatedResult<IBookingDetailsRepoResult>>;

  getAllTaskerBookings(
    taskerId: string,
    filter: IFindAllQuery,
  ): Promise<PaginatedResult<IListTaskersBooking>>;

  getBookingDetailsById(
    bookingId: string,
  ): Promise<IBookingDetailsRepoResult | null>;
}
