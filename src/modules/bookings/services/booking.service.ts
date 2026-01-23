import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { IBookingService } from '../interfaces/bookings-services.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateBookingDto } from '../dtos/create-booking-dto';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import type {
  ICategoryService,
  ISubCategoryService,
} from '@modules/categories/interfaces/categories-services.interface';
import { BOOKING_TOKEN } from '../bookings.token';
import type { IBookingRepository } from '../interfaces/bookings-repositories.interface';
import { ICreateBooking } from '../interfaces/bookings.interface';
import { IListTaskersQuery } from '@modules/tasker/interfaces/request.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import type { IS3Service } from '@core/lib/s3/s3.interface';
import { IFindAllBookingsResponse } from '../interfaces/api-responses.interface';
import { BookingDetailsResponseDto } from '../dtos/booking-details-response.dto';
import { BookingsMapper } from '../mappers/bookings.mapper';
import { GetStartCodeResponseDto } from '../dtos/get-start-code-response.dto';
import { OtpService } from '@core/lib/otp/otp.service';
import { getCurrIST } from '@shared/utility/time/convert-time.utitlity';
import { TaskStatus } from '@shared/constants/enums/task.enum';
import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';
import { ClientSession } from 'mongoose';

@Injectable()
export class BookingService implements IBookingService {
  private readonly START_CODE_EXPIRY = 1000 * 60 * 5;
  constructor(
    @Inject(CATEGORY_TOKEN.CATEGORY_SERVICE)
    private _categoryService: ICategoryService,

    @Inject(CATEGORY_TOKEN.SUBCATEGORY_SERVICE)
    private _subCategoryService: ISubCategoryService,

    @Inject(BOOKING_TOKEN.BOOKING_REPOSITORY)
    private _bookingRepo: IBookingRepository,

    @Inject(S3_SERVICE) private _s3: IS3Service,

    private _otpService: OtpService,
  ) {}

  logger = new Logger(BookingService.name);

  async getAllBookings(
    userId: string,
    filter: IListTaskersQuery,
  ): Promise<IFindAllBookingsResponse> {
    const result = await this._bookingRepo.getAllBookings({ userId }, filter);
    console.log('All docs found from repo');
    console.log(result.documents);

    const docs: BookingDetailsResponseDto[] = await Promise.all(
      result.documents.map(async (item) => {
        if (item.image) {
          item.image = await this._s3.getImageUrl(item.image);
        }
        return BookingsMapper.toResonseDetailed(item);
      }),
    );

    return { documents: docs, meta: result.meta };
  }

  async createBooking(
    userId: string,
    payload: CreateBookingDto,
  ): Promise<IBaseResponse> {
    await this.validateBookingData(payload);

    const bookingPayload: ICreateBooking = {
      ...payload,
      userId,
      payment: {},
    };
    const savedBooking = await this._bookingRepo.createBooking(bookingPayload);
    if (!savedBooking) {
      throw new InternalServerErrorException('Faild to complete booking');
    }

    return { message: 'Booking successfull' };
  }
  // by booking id
  async getBookingDetails(
    bookingId: string,
  ): Promise<BookingDetailsResponseDto> {
    const result = await this._bookingRepo.getBookingDetailsById(bookingId);

    if (!result) {
      throw new NotFoundException('Booking details not found');
    }
    console.log(result);

    // calculate total pay
    if (result.taskStatus === TaskStatus.COMPLETED) {
      result.payment.payableAmount =
        result.payment.totalAmount + (result.payment.tipAmount || 0);
    }

    return BookingsMapper.toResonseDetailed(result);
  }

  async getWorkStartCode(taskId: string): Promise<GetStartCodeResponseDto> {
    const code = this._otpService.generateOtp();
    const expireTimeInMinutes = this.START_CODE_EXPIRY / 60;
    await this._otpService.storeOtp(taskId, code, this.START_CODE_EXPIRY);
    return {
      code,
      message: `This code will expire in ${expireTimeInMinutes} minutes`,
    };
  }

  // internal user only
  async updateTipAmount(
    taskId: string,
    tipAmount: number,
    session?: ClientSession,
  ): Promise<boolean> {
    return await this._bookingRepo.updateTipAmount(taskId, tipAmount, session);
  }

  // internal user only
  async updatePaymentStatus(
    taskId: string,
    status: PaymentStatus,
  ): Promise<boolean> {
    return await this._bookingRepo.changePaymentStatus(taskId, status);
  }

  private async validateBookingData(payload: CreateBookingDto): Promise<void> {
    const [category, subcategory] = await Promise.all([
      this._categoryService.findById(payload.categoryId),
      this._subCategoryService.findById(payload.subcategoryId),
    ]);

    if (!category && !subcategory) {
      throw new NotFoundException('Category and Subcategory not found');
    }
    console.log(category?.isActive);

    // Category validations
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.isDeleted || !category.isActive) {
      throw new BadRequestException('Category is disabled or deleted');
    }

    // Subcategory validations
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    if (subcategory.isDeleted || !subcategory.isActive) {
      throw new BadRequestException('Subcategory is disabled or deleted');
    }

    // validate date
    this.validateBookingDateTime(payload.date, payload.time);

    //check tsker active or not too
  }

  private validateBookingDateTime(
    date: string, // date string from client
    time: number, // minutes from today 12:00 AM
  ): void {
    this.logger.verbose('validateBookingDateTime');
    console.log('input date, time', date, time);

    const now = getCurrIST();

    // current time in minutes from today 12 AM
    console.log('now', now);
    console.log('now hour', now.getHours());
    console.log('now minutes', now.getMinutes());

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    console.log('currentMinutes');
    console.log(currentMinutes);

    // today at 12 AM
    const today = new Date(now);

    today.setHours(0, 0, 0, 0);
    // booking date at 12 AM
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // 1️⃣ past date check
    if (bookingDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    // 2️⃣ same-day time check
    if (bookingDate.getTime() === today.getTime()) {
      console.log('same day booking');

      if (time <= currentMinutes) {
        throw new BadRequestException('Booking time cannot be in the past');
      }
    }
  }
}
