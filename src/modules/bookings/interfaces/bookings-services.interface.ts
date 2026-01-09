import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateBookingDto } from '../dtos/create-booking-dto';
import { IFindAllBookingsResponse } from './api-responses.interface';
import { IBookingDetailsRepoResult } from './bookings.interface';
import { IListBookingsQuery } from './request.interface';
import { BookingDetailsResponseDto } from '../dtos/booking-details-response.dto';

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
}

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
}

export interface IAdminBookingService {
  /**
   * Fetch all bookings
   */
  getAllBookings(filter: IListBookingsQuery): Promise<IFindAllBookingsResponse>;
}
