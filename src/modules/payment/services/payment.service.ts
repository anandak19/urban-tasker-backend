import { RAZORPAY_CLIENT } from '@config/razorpay/razorpay.provider';
import { IPayload } from '@modules/auth/interfaces/auth.interface';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Razorpay from 'razorpay';
import { Orders } from 'razorpay/dist/types/orders';
import type { IPaymentService } from '../interfaces/payment-services.interface';
import {
  IRazorpayOrderResponse,
  IRazorpayOrderVarificationResponse,
} from '../interfaces/razorpay.interface';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import type { IBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import type { ITaskerService } from '@modules/tasker/interfaces/tasker-services.interface';
import { PaymentMapper } from '../mappers/payment.mapper';
import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';
import { TaskStatus } from '@shared/constants/enums/task.enum';
import { PaymentInfoResponseDto } from '../dtos/payment-info.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import type { IPaymentRepository } from '../interfaces/payment-repositories.interface';
import { PAYMENT_TOKENS } from '../payment.token';
import { ICreatePayment } from '../interfaces/payment.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { VarifyPaymentDto } from '../dtos/varify-payment.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@config/app.config';
import type {
  IWalletService,
  IWalletTransactionService,
} from '@modules/wallet/interfaces/wallet-services.interface';
import { WALLET_TOKENS } from '@modules/wallet/wallet-tokens';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ICreateWalletTransaction } from '@modules/wallet/interfaces/wallet-transactions.interface';
import {
  WalletTransactionSource,
  WalletTransactionType,
} from '@modules/wallet/constants/wallet.enums';
// import { withTransaction } from '@shared/database/transaction.util';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @Inject(RAZORPAY_CLIENT) private readonly reazorpay: Razorpay,
    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,

    @Inject(TASKER_TOKEN.SERVICE) private _taskerService: ITaskerService,

    @Inject(PAYMENT_TOKENS.PAYMENT_REPOSITORY)
    private _paymentRepo: IPaymentRepository,

    @Inject(WALLET_TOKENS.WALLET_SERVICE)
    private _walletService: IWalletService,

    @Inject(WALLET_TOKENS.WALLET_TRANSACTION_SERVICE)
    private _walletTransactionService: IWalletTransactionService,

    @InjectConnection() private readonly connection: Connection,

    private _config: ConfigService<AppConfig>,
  ) {}

  async getPaymentDataByTaskId(
    taskId: string,
  ): Promise<PaymentInfoResponseDto> {
    const task = await this._bookingService.getBookingDetails(taskId); // contains calculated total pay

    if (task.payment?.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('This is already paid task');
    }

    if (task.taskStatus !== TaskStatus.COMPLETED) {
      throw new BadRequestException('Task is not yet completed');
    }

    const tasker = await this._taskerService.findByUserId(task.taskerId);

    if (!tasker) {
      throw new NotFoundException('Tasker not found');
    }
    return PaymentMapper.toPaymentInfoResponse(task, tasker);
  }

  async createOrder(
    userData: IPayload,
    dto: CreateOrderDto,
  ): Promise<IRazorpayOrderResponse> {
    // get task details
    const task = await this._bookingService.getBookingDetails(dto.taskId);

    if (!task) {
      throw new NotFoundException('Task details not found');
    }

    if (task.payment.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Already paid');
    }

    // calculate total pay with tip
    const tip = dto.tipAmount ? dto.tipAmount : task.payment?.tipAmount;
    const totalPayable = Number(task.payment.totalAmount) + Number(tip);

    // create new razorpay order
    const orderCreateRequestBody: Orders.RazorpayOrderCreateRequestBody = {
      currency: 'INR',
      amount: totalPayable * 100,
      receipt: `rcpt-${Date.now().toString()}-${userData.id.slice(0, 5)}`,
      notes: {
        userId: userData.id,
        userEmail: userData.email,
      },
    };
    const order = await this.reazorpay.orders.create(orderCreateRequestBody);

    //CAN USE TRANSACTION FROM HERE
    if (dto.tipAmount) {
      // update the tip field value in db here
      await this._bookingService.updateTipAmount(task.id, dto.tipAmount);
    }

    // save payment details in db
    const newPayment: ICreatePayment = {
      payerId: toObjectId(userData.id),
      receiverId: toObjectId(task.taskerId),
      taskId: toObjectId(task.id),
      tskId: task.tskId,
      razorpayPaymentId: order.id,
      razorpayReceiptId: order.receipt,
      amountInPaise: order.amount_due,
    };

    await this._paymentRepo.create(newPayment);

    return {
      orderId: order.id,
      userId: userData.id,
      amountToPaidInMinorUnits: order.amount_due,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
    };

    // return withTransaction<IRazorpayOrderResponse>(
    //   this.connection,
    //   async (session) => {
    //     // update tip amount
    //     if (dto.tipAmount) {
    //       await this._bookingService.updateTipAmount(
    //         task.id,
    //         dto.tipAmount,
    //         session,
    //       );
    //     }

    //     const newPayment: ICreatePayment = {
    //       payerId: toObjectId(userData.id),
    //       receiverId: toObjectId(task.taskerId),
    //       taskId: toObjectId(task.id),
    //       razorpayPaymentId: order.id,
    //       razorpayReceiptId: order.receipt,
    //       amountInPaise: totalPayable * 100,
    //     };

    //     await this._paymentRepo.create(newPayment, session);

    //     return {
    //       orderId: order.id,
    //       userId: userData.id,
    //       amountToPaidInMinorUnits: order.amount_due,
    //       currency: order.currency,
    //       status: order.status,
    //       receipt: order.receipt,
    //     };
    //   },
    // );
  }

  async verifyPayment(
    taskId: string,
    dto: VarifyPaymentDto,
  ): Promise<IRazorpayOrderVarificationResponse> {
    const order = await this.reazorpay.orders.fetch(dto.orderId);

    if (!order || order.status !== 'paid') {
      throw new BadRequestException('Invalid order ID or order is not paid');
    }

    const secret = this._config.get('RAZORPAY_KEY_SECREAT', { infer: true })!;

    const payload = `${dto.orderId}|${dto.razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== dto.razorpaySignature) {
      throw new BadGatewayException('Invalid Razorpay signature');
    }

    // update the status of task, paymentdoc
    const isUpdated = await this._paymentRepo.updateOneData(
      { razorpayPaymentId: dto.orderId },
      { paymentStatus: PaymentStatus.PAID },
    );

    if (!isUpdated) {
      throw new InternalServerErrorException(
        'Faild to update the payment status',
      );
    }

    // update the payment status of booking to paid
    const isBookingUpdated = await this._bookingService.updatePaymentStatus(
      taskId,
      PaymentStatus.PAID,
    );

    if (!isBookingUpdated) {
      throw new InternalServerErrorException(
        'Faild to update the payment status',
      );
    }

    // update taskers wallet
    await this.creditToTasker(taskId, order.amount_paid, dto.orderId);

    return { isPaid: true };
  }

  //Make this session based later
  private async creditToTasker(
    taskId: string,
    amountInPaise: number,
    razorpayPaymentId: string,
  ): Promise<void> {
    const amount = Math.floor(amountInPaise / 100);
    const task = await this._bookingService.getBookingDetails(taskId);
    const updatedTaskerWallet = await this._walletService.creditAmountByUserId(
      task.taskerId,
      amount,
    );

    const newTransaction: ICreateWalletTransaction = {
      amount: amount,
      referenceId: razorpayPaymentId,
      source: WalletTransactionSource.PAYMENT,
      type: WalletTransactionType.CREDIT,
      userId: toObjectId(task.userId),
      walletId: toObjectId(updatedTaskerWallet.id),
    };
    console.log('new t to save');
    console.log(newTransaction);

    // crete transaction
    await this._walletTransactionService.create(newTransaction);
  }
}
