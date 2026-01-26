import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { PaymentDocument } from '../schemas/payment.schema';
import {
  ICreatePayment,
  IPaymentListItemRepoResult,
} from './payment.interface';
import { FilterQuery } from 'mongoose';
import { ListPaymentsQueryDto } from '../dtos/query.dto';
import { PaginatedResult } from '@shared/interfaces/query.interface';

export interface IPaymentRepository
  extends IBaseRepository<PaymentDocument, ICreatePayment> {
  updateData(
    filter: FilterQuery<PaymentDocument>,
    update: Partial<PaymentDocument>,
  ): Promise<boolean>;

  findAllPayments(
    query: ListPaymentsQueryDto,
  ): Promise<PaginatedResult<IPaymentListItemRepoResult>>;

  findOnePayment(id: string): Promise<IPaymentListItemRepoResult | null>;
}
