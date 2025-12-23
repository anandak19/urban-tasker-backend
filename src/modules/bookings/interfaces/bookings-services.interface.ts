import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateBookingDto } from '../dtos/create-booking-dto';
import { IListTaskersQuery } from '@modules/tasker/interfaces/request.interface';
import { IFindAllBookingsResponse } from './api-responses.interface';

export interface IBookingService {
  /**
   * Fetch all bookings
   */
  getAllBookings(
    userId: string,
    filter: IListTaskersQuery,
  ): Promise<IFindAllBookingsResponse>;

  /**
   * Create a new booking
   */
  createBooking(
    userId: string,
    payload: CreateBookingDto,
  ): Promise<IBaseResponse>;
}
