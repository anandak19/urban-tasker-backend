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
import { PaymentStatusDto } from '../dtos/payment-status.dto';
import { BOOKING_MESSAGES } from '../constants/bookings-messages.constant';
import {
  CATEGORY_ERROR_MESSAGES,
  SUBCATEGORY_ERROR_MESSAGES,
} from '@shared/constants/messages/category-messages.constants';
import { ListCategoryCardDto } from '../dtos/popular-categories.dto';
import { BookingAnalyticsMapper } from '../mappers/booking-analytics.mapper';

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
      throw new InternalServerErrorException(BOOKING_MESSAGES.BOOKING_FAILED);
    }

    return { message: BOOKING_MESSAGES.BOOKING_SUCCESS };
  }
  // by booking id
  async getBookingDetails(
    bookingId: string,
  ): Promise<BookingDetailsResponseDto> {
    const result = await this._bookingRepo.getBookingDetailsById(bookingId);

    if (!result) {
      throw new NotFoundException(BOOKING_MESSAGES.BOOKING_NOT_FOUND);
    }
    console.log(result);

    // calculate total pay
    if (result.taskStatus === TaskStatus.COMPLETED) {
      result.payment.payableAmount =
        result.payment.subTotal + (result.payment.tipAmount || 0);
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
    session: ClientSession,
  ): Promise<boolean> {
    return await this._bookingRepo.changePaymentStatus(taskId, status, session);
  }

  async getTaskPaymentStatus(taskId: string): Promise<PaymentStatusDto> {
    const result = await this.getBookingDetails(taskId);

    return {
      paymentStatus: result.payment.paymentStatus,
    };
  }

  async getMostBookedCategories(): Promise<ListCategoryCardDto[]> {
    const result = await this._bookingRepo.getMostBookedCategories();
    return Promise.all(
      result.map(async (item) => {
        const imageUrl = await this._s3.getImageUrl(item.imagePublicKey);
        return BookingAnalyticsMapper.toListCategoryCard(item, imageUrl);
      }),
    );
  }

  // cancel booking
  async cancelBooking(bookingId: string): Promise<IBaseResponse> {
    const booking = await this._bookingRepo.findById(bookingId);

    if (!booking) {
      throw new NotFoundException(BOOKING_MESSAGES.BOOKING_NOT_FOUND);
    }

    if (
      booking.taskStatus === TaskStatus.COMPLETED ||
      booking.taskStatus === TaskStatus.IN_PROGRESS ||
      booking.taskStatus === TaskStatus.OVERDUE
    ) {
      throw new BadRequestException(BOOKING_MESSAGES.CANCELL_CONFLICT);
    }

    const updated = await this._bookingRepo.changeBookingStatus(
      bookingId,
      TaskStatus.CANCELLED,
    );

    if (!updated) {
      throw new InternalServerErrorException(BOOKING_MESSAGES.CANCELL_FAILD);
    }

    return { message: BOOKING_MESSAGES.CANCELL_SUCCESS };
  }

  private async validateBookingData(payload: CreateBookingDto): Promise<void> {
    const [category, subcategory] = await Promise.all([
      this._categoryService.findById(payload.categoryId),
      this._subCategoryService.findById(payload.subcategoryId),
    ]);

    if (!category && !subcategory) {
      throw new NotFoundException(CATEGORY_ERROR_MESSAGES.NOT_FOUND);
    }

    // Category validations
    if (!category) {
      throw new NotFoundException(CATEGORY_ERROR_MESSAGES.NOT_FOUND);
    }

    if (category.isDeleted || !category.isActive) {
      throw new BadRequestException(CATEGORY_ERROR_MESSAGES.NOT_FOUND);
    }

    // Subcategory validations
    if (!subcategory) {
      throw new NotFoundException(SUBCATEGORY_ERROR_MESSAGES.NOT_FOUND);
    }

    if (subcategory.isDeleted || !subcategory.isActive) {
      throw new BadRequestException(SUBCATEGORY_ERROR_MESSAGES.NOT_FOUND);
    }

    // validate date
    this.validateBookingDateTime(payload.date, payload.time);

    //check tsker active or not too
  }

  private validateBookingDateTime(
    date: string, // date string from client
    time: number, // minutes from today 12:00 AM
  ): void {
    const now = getCurrIST();

    // current time in minutes from today 12 AM
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // today at 12 AM
    const today = new Date(now);

    today.setHours(0, 0, 0, 0);
    // booking date at 12 AM
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    //  past date check
    if (bookingDate < today) {
      throw new BadRequestException(BOOKING_MESSAGES.BOOKING_DATE_IN_PAST);
    }

    // same-day time check
    if (bookingDate.getTime() === today.getTime()) {
      if (time <= currentMinutes) {
        throw new BadRequestException(BOOKING_MESSAGES.BOOKING_TIME_IN_PAST);
      }
    }
  }
}
