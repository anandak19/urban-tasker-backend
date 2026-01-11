import { PaginatedResult } from '@shared/interfaces/query.interface';
import { BookingDocument } from '../schemas/booking.schema';
import {
  IBookingDetailsRepoResult,
  IBookingMatchArgs,
  ICreateBooking,
} from './bookings.interface';
import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { IListBookingsQuery } from './request.interface';
import { TaskStatus } from '@shared/constants/enums/task.enum';

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

  getBookingDetailsById(
    bookingId: string,
  ): Promise<IBookingDetailsRepoResult | null>;

  changeBookingStatus(
    bookingId: string,
    status: TaskStatus,
  ): Promise<BookingDocument | null>;

  // ~ NOT TESTED
  /**
   * Add currentBreakStartTime with current time
   * @param taskId
   * @param startTime
   */
  startBreak(taskId: string, startTime: Date): Promise<boolean>;

  // ~ NOT TESTED
  /**
   * Add currentBreakEndTime with current time
   * calculate the current total break time
   * add the current total break time to existing total break time
   * @param taskId
   * @param breakEndTime
   */
  endBreak(taskId: string, breakEndTime: Date): Promise<boolean>;
}
