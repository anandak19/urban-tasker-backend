import { ListPaymentDto } from '@modules/payment/dtos/list-payments.dto';
import { ListPaymentsQueryDto } from '@modules/payment/dtos/query.dto';
import { IFindAllPaymentsResponse } from '@modules/payment/interfaces/api-response.interface';
import type { IPaymentRepository } from '@modules/payment/interfaces/payment-repositories.interface';
import { IAdminPaymentService } from '@modules/payment/interfaces/payment-services.interface';
import { PaymentMapper } from '@modules/payment/mappers/payment.mapper';
import { PAYMENT_TOKENS } from '@modules/payment/payment.token';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PaymentAdminService implements IAdminPaymentService {
  constructor(
    @Inject(PAYMENT_TOKENS.PAYMENT_REPOSITORY)
    private _paymentRepo: IPaymentRepository,
  ) {}
  // find all

  async findAllPayments(
    query: ListPaymentsQueryDto,
  ): Promise<IFindAllPaymentsResponse> {
    const result = await this._paymentRepo.findAllPayments(query);

    const documents = result.documents.map((item) =>
      PaymentMapper.toListResponse(item),
    );

    return {
      documents,
      meta: result.meta,
    };
  }

  async findOneById(id: string): Promise<ListPaymentDto> {
    const result = await this._paymentRepo.findOnePayment(id);

    if (!result) {
      throw new NotFoundException('Payment Details not found');
    }

    return PaymentMapper.toListResponse(result);
  }
}
