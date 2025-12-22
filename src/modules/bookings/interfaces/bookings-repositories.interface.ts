import { BookingDocument } from '../schemas/booking.schema';
import { ICreateBooking } from './bookings.interface';

export interface IBookingRepository {
  /**
   * Create a new booking
   */
  createBooking(payload: ICreateBooking): Promise<BookingDocument>;
}
