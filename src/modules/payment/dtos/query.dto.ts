import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class ListPaymentsQueryDto extends GetDocsDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}
