import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateBookingDto } from '../dtos/create-booking-dto';
import { IFindAllBookingsResponse } from './api-responses.interface';
import { IBookingDetailsRepoResult } from './bookings.interface';
import { IListBookingsQuery } from './request.interface';
import { BookingDetailsResponseDto } from '../dtos/booking-details-response.dto';
import { GetStartCodeResponseDto } from '../dtos/get-start-code-response.dto';

export interface IBookingService {
  /**
   * Fetch all bookings
   */
  getAllBookings(
    userId: string,
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse>;

  /**
   * Create a new booking
   */
  createBooking(
    userId: string,
    payload: CreateBookingDto,
  ): Promise<IBaseResponse>;

  /**
   * Get single booking details
   */
  getBookingDetails(bookingId: string): Promise<BookingDetailsResponseDto>;

  decorateWithImageUrl(
    item: IBookingDetailsRepoResult,
  ): Promise<IBookingDetailsRepoResult>;

  /**
   * To get a 4 digit work starter code
   * @param taskId
   */
  getWorkStartCode(taskId: string): Promise<GetStartCodeResponseDto>;
}

// service belongs to the booking and tasker
export interface ITaskerBookingService {
  /**
   * Fetch all taskers bookings
   */
  getAllTaskersBookings(
    taskerId: string,
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse>;

  /**
   * Accept one task/booking by its id: :id/accept
   */
  acceptTask(taskId: string): Promise<IBaseResponse>;

  /**
   * Reject one task/booking by its id: :id/reject
   */
  rejectTask(taskId: string): Promise<IBaseResponse>;

  /**
   * To varify start code and change status to in_progress
   * @param taskId
   * @param code
   */
  verifyStartCodeAndStartWork(
    taskId: string,
    code: string,
  ): Promise<IBaseResponse>;

  // ~ not tested
  /**
   * To take break in the task
   * @param taskId
   */
  takeBreak(taskId: string): Promise<IBaseResponse>;

  // ~ not tested
  /**
   * To resume task
   * @param taskId
   */
  resumeTask(taskId: string): Promise<IBaseResponse>;
}

export interface IAdminBookingService {
  /**
   * Fetch all bookings
   */
  getAllBookings(filter: IListBookingsQuery): Promise<IFindAllBookingsResponse>;
}
