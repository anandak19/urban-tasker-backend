import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { BookingDetailsResponseDto } from '@modules/bookings/dtos/booking-details-response.dto';
import { IFindAllBookingsResponse } from '@modules/bookings/interfaces/api-responses.interface';
import type { IBookingRepository } from '@modules/bookings/interfaces/bookings-repositories.interface';
import type {
  IBookingService,
  ITaskerBookingService,
} from '@modules/bookings/interfaces/bookings-services.interface';
import { IListBookingsQuery } from '@modules/bookings/interfaces/request.interface';
import { BookingsMapper } from '@modules/bookings/mappers/bookings.mapper';

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TaskStatus } from '@shared/constants/enums/task.enum';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

@Injectable()
export class TaskerBookingService implements ITaskerBookingService {
  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,

    @Inject(BOOKING_TOKEN.BOOKING_REPOSITORY)
    private _bookingRepo: IBookingRepository,
  ) {}

  getOneTaskDetails(taskId: string) {
    console.log(taskId);
    throw new Error('not implemented');
  }

  async acceptTask(taskId: string): Promise<IBaseResponse> {
    const result = await this._bookingRepo.updateById(taskId, {
      $set: { isAccepted: true },
    });

    if (!result) {
      throw new InternalServerErrorException('Faild to accept task');
    }

    return { message: 'Accepted task' };
  }

  async rejectTask(taskId: string): Promise<IBaseResponse> {
    const result = await this._bookingRepo.updateById(taskId, {
      $set: { taskStatus: TaskStatus.REJECTED },
    });

    if (!result) {
      throw new InternalServerErrorException('Faild to reject task');
    }

    return { message: 'Rejected task' };
  }

  async getAllTaskersBookings(
    taskerId: string,
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse> {
    const result = await this._bookingRepo.getAllBookings({ taskerId }, filter);
    console.log(result);

    const docs: BookingDetailsResponseDto[] = await Promise.all(
      result.documents.map(async (item) => {
        const decorated = await this._bookingService.decorateWithImageUrl(item);
        return BookingsMapper.toResonseDetailed(decorated);
      }),
    );

    console.log(docs);

    return { documents: docs, meta: result.meta };
  }
}
