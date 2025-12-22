import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateBookingDto } from '../dtos/create-booking-dto';

export interface IBookingService {
  /**
   * Create a new booking
   */
  createBooking(
    userId: string,
    payload: CreateBookingDto,
  ): Promise<IBaseResponse>;
}
