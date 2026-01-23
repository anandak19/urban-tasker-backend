import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { PaymentDocument } from '../schemas/payment.schema';
import { ICreatePayment } from './payment.interface';
import { FilterQuery } from 'mongoose';

export interface IPaymentRepository
  extends IBaseRepository<PaymentDocument, ICreatePayment> {
  updateData(
    filter: FilterQuery<PaymentDocument>,
    update: Partial<PaymentDocument>,
  ): Promise<boolean>;
}
