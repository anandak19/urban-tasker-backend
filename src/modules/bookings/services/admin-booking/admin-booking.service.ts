import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { BookingDetailsResponseDto } from '@modules/bookings/dtos/booking-details-response.dto';
import { IFindAllBookingsResponse } from '@modules/bookings/interfaces/api-responses.interface';
import type { IBookingRepository } from '@modules/bookings/interfaces/bookings-repositories.interface';
import { IAdminBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import { ITaskStatusGraphAggregationResult } from '@modules/bookings/interfaces/bookings.interface';
import { IEarningsAggregationResponse } from '@modules/bookings/interfaces/repo-responses.interface';
import { IListBookingsQuery } from '@modules/bookings/interfaces/request.interface';
import { BookingsMapper } from '@modules/bookings/mappers/bookings.mapper';
import { BookingSummaryListItemDto } from '@modules/reports/dtos/bookings-summery.dto';
import { GraphDataItemDto } from '@modules/reports/dtos/graph-data.dto';
import {
  BookingReportFilterDto,
  BookingSummaryFilter,
} from '@modules/reports/dtos/query-filters.dto';
import { Inject, Injectable } from '@nestjs/common';
import { UserRoles } from '@shared/constants/enums/user.enum';
import { PaginatedResult } from '@shared/interfaces/query.interface';

@Injectable()
export class AdminBookingService implements IAdminBookingService {
  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_REPOSITORY)
    private _bookingRepo: IBookingRepository,

    @Inject(S3_SERVICE) private _s3: IS3Service,
  ) {}

  async getAllBookings(
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse> {
    const result = await this._bookingRepo.getAllBookings({}, filter);

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

  // internal
  async getEarningsSummery(): Promise<IEarningsAggregationResponse> {
    return await this._bookingRepo.getEarningsSummery();
  }

  getBookingSummery(
    filter: BookingSummaryFilter,
  ): Promise<PaginatedResult<BookingSummaryListItemDto>> {
    return this._bookingRepo.getBookingSummery(filter);
  }

  getGraphData(
    filter: BookingReportFilterDto = {},
  ): Promise<GraphDataItemDto[]> {
    return this._bookingRepo.getGraphData(UserRoles.ADMIN, filter);
  }

  async getStatusGraphData(): Promise<ITaskStatusGraphAggregationResult[]> {
    return await this._bookingRepo.getStatusGraphData();
  }
}
