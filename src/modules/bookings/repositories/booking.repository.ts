import { BaseRepository } from '@shared/repository/base.repository';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { ICreateBooking } from '../interfaces/bookings.interface';
import { IBookingRepository } from '../interfaces/bookings-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

export class BookingRepository
  extends BaseRepository<BookingDocument, ICreateBooking>
  implements IBookingRepository
{
  constructor(
    @InjectModel(Booking.name)
    private readonly _bookingModel: Model<BookingDocument>,
  ) {
    super(_bookingModel);
  }

  async createBooking(payload: ICreateBooking): Promise<BookingDocument> {
    payload.categoryId = toObjectId(payload.categoryId);
    payload.subcategoryId = toObjectId(payload.subcategoryId);
    payload.taskerId = toObjectId(payload.taskerId);
    payload.userId = toObjectId(payload.userId);
    return this.create(payload);
  }
}
