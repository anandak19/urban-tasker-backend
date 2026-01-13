import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
    console.log('doc found from repo');
    console.log(result);

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
    date: string, // YYYY-MM-DD
    time: string, // HH:mm
  ): void {
    // Normalize today (date-only)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    //  Past date check
    if (bookingDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    // Same-day time check
    if (bookingDate.getTime() === today.getTime()) {
      const [hour, minute] = time.split(':').map(Number);

      const bookingDateTime = new Date();
      bookingDateTime.setHours(hour, minute, 0, 0);

      if (bookingDateTime <= new Date()) {
        throw new BadRequestException('Booking time cannot be in the past');
      }
    }
  }
}
