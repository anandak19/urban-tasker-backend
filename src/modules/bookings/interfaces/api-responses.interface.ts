import { PaginatedResult } from '@shared/interfaces/query.interface';
import { BookingDetailsResponseDto } from '../dtos/booking-details-response.dto';

export type IFindAllBookingsResponse =
  PaginatedResult<BookingDetailsResponseDto>;

// report summery
// export type IFindAllReportsSummary = PaginatedResult;
