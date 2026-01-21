export enum WalletTransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum WalletTransactionSource {
  PAYMENT = 'payment',
  REFUND = 'refund',
  WITHDRAWAL = 'withdrawal',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

// wallet status
export enum WalletStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  SUSPENDED = 'suspended',
}
