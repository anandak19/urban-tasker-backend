// import { BookingSummaryListItemDto } from '@modules/reports/dtos/bookings-summery.dto';

export interface IEarningsAggregationResult {
  totalTasksCompleted: { count: number }[];
  totalEarnings: { earnings: number }[];
  totalTransactionAmount: { totalAmount: number }[];
}

export interface IEarningsAggregationResponse {
  totalTasksCompleted: number;
  totalEarnings: number;
  totalIncomingAmount: number;
}
