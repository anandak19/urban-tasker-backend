import { BaseRepository } from '@shared/repository/base.repository';
import { Payment, PaymentDocument } from '../schemas/payment.schema';
import { ICreatePayment } from '../interfaces/payment.interface';
import { IPaymentRepository } from '../interfaces/payment-repositories.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class PaymentRepository
  extends BaseRepository<PaymentDocument, ICreatePayment>
  implements IPaymentRepository
{
  constructor(
    @InjectModel(Payment.name) private _paymentModel: Model<PaymentDocument>,
  ) {
    super(_paymentModel);
  }

  async updateData(
    filter: FilterQuery<PaymentDocument>,
    update: Partial<PaymentDocument>,
  ): Promise<boolean> {
    const result = await this._paymentModel.updateOne(filter, { $set: update });

    return result.modifiedCount > 0;
  }
}
