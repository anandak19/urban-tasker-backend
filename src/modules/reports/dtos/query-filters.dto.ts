import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IsEnum } from 'class-validator';
import { BookingGroupBy } from '../constants/filter.enum';

export class BookingSummaryFilter extends GetDocsDto {
  @IsEnum(BookingGroupBy)
  groupBy: BookingGroupBy;
}
