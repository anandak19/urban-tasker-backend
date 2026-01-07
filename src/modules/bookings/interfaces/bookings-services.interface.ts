import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateBookingDto } from '../dtos/create-booking-dto';
import { IFindAllBookingsResponse } from './api-responses.interface';
import { IListBookingBasic } from './bookings.interface';
import { IListBookingsQuery } from './request.interface';

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

  decorateWithImageUrl<T extends IListBookingBasic>(item: T): Promise<T>;
}

/**
 * TODOS
 * 2. View one task/booking details by its id: :id
 * 3. Accept one task/booking by its id: :id/accept
 * 4. Reject one task/booking by its id: :id/reject
 */
export interface ITaskerBookingService {
  /**
   * Fetch all taskers bookings
   */
  getAllTaskersBookings(
    taskerId: string,
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse>;
}
