import { ListPaymentsQueryDto } from '@modules/payment/dtos/query.dto';
import type { IAdminPaymentService } from '@modules/payment/interfaces/payment-services.interface';
import { PAYMENT_TOKENS } from '@modules/payment/payment.token';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';

@Controller('admin/payment')
export class PaymentAdminController {
  constructor(
    @Inject(PAYMENT_TOKENS.ADMIN_PAYMENT_SERVICE)
    private _adminPaymentService: IAdminPaymentService,
  ) {}

  @Get()
  findAllPayments(@Query() query: ListPaymentsQueryDto) {
    return this._adminPaymentService.findAllPayments(query);
  }

  @Get(':paymentId')
  findOnePaymentById(@Param('paymentId') payemtId: string) {
    return this._adminPaymentService.findOneById(payemtId);
  }
}
