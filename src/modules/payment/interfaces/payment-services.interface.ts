import { IPayload } from '@modules/auth/interfaces/auth.interface';
import {
  IRazorpayOrderResponse,
  IRazorpayOrderVarificationResponse,
} from './razorpay.interface';
import { PaymentInfoResponseDto } from '../dtos/payment-info.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { VarifyPaymentDto } from '../dtos/varify-payment.dto';

export interface IPaymentService {
  getPaymentDataByTaskId(taskId: string): Promise<PaymentInfoResponseDto>;

  createOrder(
    userData: IPayload,
    dto: CreateOrderDto,
  ): Promise<IRazorpayOrderResponse>;

  verifyPayment(
    userData: IPayload,
    taskId: string,
    dto: VarifyPaymentDto,
  ): Promise<IRazorpayOrderVarificationResponse>;
}
