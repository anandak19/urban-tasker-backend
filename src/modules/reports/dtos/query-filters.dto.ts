import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { BookingGroupBy } from '../constants/filter.enum';
import { Transform } from 'class-transformer';
import { ToEndDate, ToStartDate } from '@core/transformers/date.transformer';

export class BookingSummaryFilter extends GetDocsDto {
  @IsEnum(BookingGroupBy)
  groupBy: BookingGroupBy;
}

export class BookingReportFilterDto {
  @IsOptional()
  @Transform(ToStartDate)
  startDate?: Date;

  @IsOptional()
  @Transform(ToEndDate)
  endDate?: Date;
}
