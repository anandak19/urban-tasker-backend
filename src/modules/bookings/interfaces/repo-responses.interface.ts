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
