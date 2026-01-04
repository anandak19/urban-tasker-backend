import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { IFindAllBookingsResponse } from '@modules/bookings/interfaces/api-responses.interface';
import type { IBookingRepository } from '@modules/bookings/interfaces/bookings-repositories.interface';
import type {
  IBookingService,
  ITaskerBookingService,
} from '@modules/bookings/interfaces/bookings-services.interface';
import { IListTaskersBooking } from '@modules/bookings/interfaces/bookings.interface';
import { IListBookingsQuery } from '@modules/bookings/interfaces/request.interface';

import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TaskerBookingService implements ITaskerBookingService {
  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,

    @Inject(BOOKING_TOKEN.BOOKING_REPOSITORY)
    private _bookingRepo: IBookingRepository,
  ) {}

  async getAllTaskersBookings(
    taskerId: string,
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse> {
    const result = await this._bookingRepo.getAllTaskerBookings(
      taskerId,
      filter,
    );
    console.log(result);

    const docs: IListTaskersBooking[] = await Promise.all(
      result.documents.map((item) =>
        this._bookingService.decorateWithImageUrl<IListTaskersBooking>(item),
      ),
    );
    console.log(docs);

    return { documents: docs, meta: result.meta };
  }
}
