import { BookingDetailsResponseDto } from '@modules/bookings/dtos/booking-details-response.dto';
import { ITasker } from '@modules/tasker/interfaces/tasker.interface';
import { PaymentInfoResponseDto } from '../dtos/payment-info.dto';
import { convertSecondsToHHMM } from '@shared/utility/time/convert-time.utitlity';

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
      totalPayable: bookingData.payment.payableAmount,
      totalWorkHours: convertSecondsToHHMM(
        bookingData.taskTimes!.totalTaskTime,
      ), // Remove ! later
    };
  }
}
