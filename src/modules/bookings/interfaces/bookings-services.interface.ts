import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateBookingDto } from '../dtos/create-booking-dto';
import { IFindAllBookingsResponse } from './api-responses.interface';
import { IListBookingBasic } from './bookings.interface';
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

  decorateWithImageUrl<T extends IListBookingBasic>(item: T): Promise<T>;
}

/**
 * TODOS
 * 2. View one task/booking details by its id: :id
 * 3.
 * 4.
 */
export interface ITaskerBookingService {
  /**
   * Fetch all taskers bookings
   */
  getAllTaskersBookings(
    taskerId: string,
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse>;

  /**
   * Fetch One task details
   */
  getOneTaskDetails(taskId: string); // --give a response type

  /**
   * Accept one task/booking by its id: :id/accept
   */
  acceptTask(taskId: string): Promise<IBaseResponse>;

  /**
   * Reject one task/booking by its id: :id/reject
   */
  rejectTask(taskId: string): Promise<IBaseResponse>;
}
