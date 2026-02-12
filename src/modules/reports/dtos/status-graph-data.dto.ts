export class StatusGraphDataDto {
  pending: number;
  inProgress: number;
  completed: number;
  rejected: number;
  cancelled: number;
  overdue: number;
}

export class PaymentStatusGraphDataDto {
  created: number;
  attempted: number;
  paid: number;
  faild: number;
  pending: number;
}
