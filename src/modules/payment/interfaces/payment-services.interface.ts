import { IPayload } from '@modules/auth/interfaces/auth.interface';
import {
  IRazorpayOrderResponse,
  IRazorpayOrderVarificationResponse,
} from './razorpay.interface';
import { PaymentInfoResponseDto } from '../dtos/payment-info.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { VarifyPaymentDto } from '../dtos/varify-payment.dto';
import { ListPaymentsQueryDto } from '../dtos/query.dto';
import { IFindAllPaymentsResponse } from './api-response.interface';
import { ListPaymentDto } from '../dtos/list-payments.dto';
import { IPaymentStatusGraphAggregationResult } from './repo-response.interface';

export interface IPaymentService {
  getPaymentDataByTaskId(taskId: string): Promise<PaymentInfoResponseDto>;

  createOrder(
    userData: IPayload,
    dto: CreateOrderDto,
  ): Promise<IRazorpayOrderResponse>;

  verifyPayment(
    taskId: string,
    dto: VarifyPaymentDto,
  ): Promise<IRazorpayOrderVarificationResponse>;
}

export interface IAdminPaymentService {
  findAllPayments(
    query: ListPaymentsQueryDto,
  ): Promise<IFindAllPaymentsResponse>;

  findOneById(id: string): Promise<ListPaymentDto>;

  getPaymentStatusGraphData(): Promise<IPaymentStatusGraphAggregationResult[]>;
}
