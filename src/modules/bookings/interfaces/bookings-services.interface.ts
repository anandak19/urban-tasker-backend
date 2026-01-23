import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateBookingDto } from '../dtos/create-booking-dto';
import { IFindAllBookingsResponse } from './api-responses.interface';
import { IListBookingsQuery } from './request.interface';
import { BookingDetailsResponseDto } from '../dtos/booking-details-response.dto';
import { GetStartCodeResponseDto } from '../dtos/get-start-code-response.dto';
import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';
import { ClientSession } from 'mongoose';
import { PaymentStatusDto } from '../dtos/payment-status.dto';

export interface IBookingService {
  /**
   * Fetch all bookings
   */
  getAllBookings(
    userId: string,
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse>;

  /**
   * Create a new booking
   */
  createBooking(
    userId: string,
    payload: CreateBookingDto,
  ): Promise<IBaseResponse>;

  /**
   * Get single booking details
   */
  getBookingDetails(
    bookingId: string,
    session?: ClientSession,
  ): Promise<BookingDetailsResponseDto>;

  /**
   * To get a 4 digit work starter code
   * @param taskId
   */
  getWorkStartCode(taskId: string): Promise<GetStartCodeResponseDto>;

  updateTipAmount(
    taskId: string,
    tipAmount: number,
    session?: ClientSession,
  ): Promise<boolean>;

  updatePaymentStatus(taskId: string, status: PaymentStatus): Promise<boolean>;

  getTaskPaymentStatus(taskId: string): Promise<PaymentStatusDto>;
}

// service belongs to the booking and tasker
export interface ITaskerBookingService {
  /**
   * Fetch all taskers bookings
   */
  getAllTaskersBookings(
    taskerId: string,
    filter: IListBookingsQuery,
  ): Promise<IFindAllBookingsResponse>;

  /**
   * Accept one task/booking by its id: :id/accept
   */
  acceptTask(taskId: string): Promise<IBaseResponse>;

  /**
   * Reject one task/booking by its id: :id/reject
   */
  rejectTask(taskId: string): Promise<IBaseResponse>;

  /**
   * To varify start code and change status to in_progress
   * @param taskId
   * @param code
   */
  verifyStartCodeAndStartWork(
    taskId: string,
    code: string,
  ): Promise<IBaseResponse>;

  /**
   * To take break in the task
   * @param taskId
   */
  takeBreak(taskId: string): Promise<IBaseResponse>;

  /**
   * To resume task
   * @param taskId
   */
  resumeTask(taskId: string): Promise<IBaseResponse>;

  // ~ not tested
  finishTask(taskId: string): Promise<IBaseResponse>;
}

export interface IAdminBookingService {
  /**
   * Fetch all bookings
   */
  getAllBookings(filter: IListBookingsQuery): Promise<IFindAllBookingsResponse>;
}
