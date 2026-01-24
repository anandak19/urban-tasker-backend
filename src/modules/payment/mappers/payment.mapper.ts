import { BookingDetailsResponseDto } from '@modules/bookings/dtos/booking-details-response.dto';
import { ITasker } from '@modules/tasker/interfaces/tasker.interface';
import { PaymentInfoResponseDto } from '../dtos/payment-info.dto';
import { convertSecondsToHHMM } from '@shared/utility/time/convert-time.utitlity';
import { IPaymentListItemRepoResult } from '../interfaces/payment.interface';
import { ListPaymentDto } from '../dtos/list-payments.dto';

export class PaymentMapper {
  static toPaymentInfoResponse(
    bookingData: BookingDetailsResponseDto,
    taskerInfo: ITasker,
  ): PaymentInfoResponseDto {
    return {
      hourlyRate: Number(taskerInfo.hourlyRate),
      paymentStatus: bookingData.payment.paymentStatus,
      serviceFee: bookingData.payment.totalAmount,
      tipAmount: bookingData.payment.tipAmount,

      platFormFee: bookingData.payment.platFormFee,
      subTotal: bookingData.payment.subTotal,

      totalPayable: bookingData.payment.payableAmount,
      totalWorkHours: convertSecondsToHHMM(
        bookingData.taskTimes!.totalTaskTime,
      ), // Remove ! later
    };
  }

  static toListResponse(data: IPaymentListItemRepoResult): ListPaymentDto {
    console.log(data);

    return {
      paymentId: data.razorpayPaymentId,
      sender: data.senderName,
      receiver: data.receiverName,
      amount: Math.floor(data.amountInPaise / 100),
      status: data.paymentStatus,
      receiptId: data.razorpayReceiptId,
      paidAt: data.createdAt,
      tskId: data.tskId,
      id: data.id,
    };
  }
}
