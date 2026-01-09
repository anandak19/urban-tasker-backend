import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { BookingDetailsResponseDto } from '@modules/bookings/dtos/booking-details-response.dto';
import { IFindAllBookingsResponse } from '@modules/bookings/interfaces/api-responses.interface';
import type { IBookingRepository } from '@modules/bookings/interfaces/bookings-repositories.interface';
import { IAdminBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import { IListBookingsQuery } from '@modules/bookings/interfaces/request.interface';
import { BookingsMapper } from '@modules/bookings/mappers/bookings.mapper';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AdminBookingService implements IAdminBookingService {
  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_REPOSITORY)
    private _bookingRepo: IBookingRepository,
  ) {}

  async getAllBookings(
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse> {
    const result = await this._bookingRepo.getAllBookings({}, filter);

    const docs: BookingDetailsResponseDto[] = result.documents.map((item) =>
      BookingsMapper.toResonseDetailed(item),
    );

    return { documents: docs, meta: result.meta };
  }
}
