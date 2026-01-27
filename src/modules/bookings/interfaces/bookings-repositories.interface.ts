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
import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';
import { ClientSession } from 'mongoose';
import { IEarningsAggregationResponse } from './repo-responses.interface';
import { BookingSummaryFilter } from '@modules/reports/dtos/query-filters.dto';
import { BookingSummaryListItemDto } from '@modules/reports/dtos/bookings-summery.dto';
import { GraphDataItemDto } from '@modules/reports/dtos/graph-data.dto';

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

  changePaymentStatus(taskId: string, status: PaymentStatus): Promise<boolean>;

  markTaskStartTime(taskId: string, time: Date): Promise<boolean>;

  markTaskEndTime(taskId: string, time: Date): Promise<boolean>;

  /**
   * Add currentBreakStartTime with current time
   * @param taskId
   * @param startTime
   */
  startBreak(taskId: string, startTime: Date): Promise<boolean>;

  /**
   * Add currentBreakEndTime with current time
   * calculate the current total break time
   * add the current total break time to existing total break time
   * @param taskId
   * @param breakEndTime
   */
  endBreak(taskId: string, breakEndTime: Date): Promise<boolean>;

  /**
   * Set taskStatus to completed
   * Set the task end time
   * finds total task time by subtracting the break from total time
   * @param taskId
   * @param endTime
   */
  finishTask(taskId: string, endTime: Date): Promise<boolean>;

  /**
   * Set total amount after calculation
   * set payment status to pending
   */
  updateAmounts(
    taskId: string,
    amount: number,
    platFormFee: number,
    subTotal: number,
  ): Promise<boolean>;

  updateTipAmount(
    taskId: string,
    tipAmount: number,
    session?: ClientSession,
  ): Promise<boolean>;

  getEarningsSummery(): Promise<IEarningsAggregationResponse>;

  getBookingSummery(
    filter: BookingSummaryFilter,
  ): Promise<PaginatedResult<BookingSummaryListItemDto>>;

  getGraphData(): Promise<GraphDataItemDto[]>;
}
