import { OtpService } from '@core/lib/otp/otp.service';
import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
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
import type { ITaskerService } from '@modules/tasker/interfaces/tasker-services.interface';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TaskStatus } from '@shared/constants/enums/task.enum';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

@Injectable()
export class TaskerBookingService implements ITaskerBookingService {
  private readonly PLATFORM_FEE_PERCENTAGE = 3;

  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,

    @Inject(BOOKING_TOKEN.BOOKING_REPOSITORY)
    private _bookingRepo: IBookingRepository,

    @Inject(TASKER_TOKEN.SERVICE)
    private _taskerService: ITaskerService,

    @Inject(S3_SERVICE) private _s3: IS3Service,

    private _otpService: OtpService,
  ) {}

  // pending
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
        if (item.image) {
          item.image = await this._s3.getImageUrl(item.image);
        }
        return BookingsMapper.toResonseDetailed(item);
      }),
    );

    console.log(docs);

    return { documents: docs, meta: result.meta };
  }

  async verifyStartCodeAndStartWork(
    taskId: string,
    code: string,
  ): Promise<IBaseResponse> {
    const result = await this._otpService.varifyOtp(taskId, code);

    if (!result) {
      throw new BadRequestException('Start code expired or invalid');
    }

    const updated = await this._bookingRepo.changeBookingStatus(
      taskId,
      TaskStatus.IN_PROGRESS,
    );

    if (!updated) {
      throw new InternalServerErrorException(
        'Faild to change task status to start',
      );
    }

    //update start time in timings
    const timeUpdated = await this._bookingRepo.markTaskStartTime(
      taskId,
      new Date(),
    );

    if (!timeUpdated) {
      throw new InternalServerErrorException('Faild to start task timer');
    }

    return { message: 'Code varified and task is in progress' };
  }

  async takeBreak(taskId: string): Promise<IBaseResponse> {
    const isUpdated = await this._bookingRepo.startBreak(taskId, new Date());
    if (!isUpdated) {
      throw new ConflictException('Break is already active');
    }

    return { message: 'Break Started' };
  }

  async resumeTask(taskId: string): Promise<IBaseResponse> {
    const isUpdated = await this._bookingRepo.endBreak(taskId, new Date());

    if (!isUpdated) {
      throw new ConflictException('No active break to resume');
    }

    return { message: 'Break ended and task is resumed' };
  }

  async finishTask(taskId: string): Promise<IBaseResponse> {
    //update timer and status
    const isTimeUpdated = await this._bookingRepo.finishTask(
      taskId,
      new Date(),
    );

    if (!isTimeUpdated) {
      throw new InternalServerErrorException('Faild to stop task timer');
    }

    const task = await this._bookingService.getBookingDetails(taskId); // returns details with calculated pay

    // get tasker details
    const tasker = await this._taskerService.findByUserId(task.taskerId);
    const hourlyRate = Number(tasker.hourlyRate);

    // calculate the amount in total
    const totalAmount = this.calculateAmount(
      task.taskTimes!.totalTaskTime,
      hourlyRate,
    );

    const platformFee = this.calcuatePlatformFee(totalAmount);

    // record the amount in db
    const updated = await this._bookingRepo.updateAmounts(
      taskId,
      totalAmount,
      platformFee,
      totalAmount + platformFee,
    );

    console.log(totalAmount);

    if (!updated) {
      throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
    }

    return { message: 'Task marked completed' };
  }

  // Private methods

  private calculateAmount(totalWorkInSec: number, houlyRate: number): number {
    const hours = totalWorkInSec / 3600;
    return Math.round(hours * houlyRate);
  }

  private calcuatePlatformFee(serviceCharge: number) {
    const amount = (this.PLATFORM_FEE_PERCENTAGE / 100) * serviceCharge;
    return Math.floor(amount);
  }
}
