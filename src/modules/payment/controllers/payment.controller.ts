import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PAYMENT_TOKENS } from '../payment.token';
import type { IPaymentService } from '../interfaces/payment-services.interface';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { VarifyPaymentDto } from '../dtos/varify-payment.dto';

@UseGuards(AuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject(PAYMENT_TOKENS.PAYMENT_SERVICE)
    private _paymentService: IPaymentService,
  ) {}

  @Get(':taskId/info')
  getPaymentInfo(@Param('taskId') taskId: string) {
    return this._paymentService.getPaymentDataByTaskId(taskId);
  }

  @Post('create-order')
  createOrder(
    @Request() req: IAuthenticatedReqeust,
    @Body() dto: CreateOrderDto,
  ) {
    return this._paymentService.createOrder(req.user, dto);
  }

  @Post('varify-payment/:orderId')
  verifyPayment(
    @Param('orderId') taskId: string,
    @Body() dto: VarifyPaymentDto,
  ) {
    console.log('incoming id', taskId);
    return this._paymentService.verifyPayment(taskId, dto);
  }
}
