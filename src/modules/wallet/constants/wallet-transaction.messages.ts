export const WALLET_TRANSACTION_MESSAGES = {
  /* =======================
   * SUCCESS
   * ======================= */
  TRANSACTION_CREATED: 'Wallet transaction created successfully',
  TRANSACTION_FETCHED: 'Wallet transaction fetched successfully',
  TRANSACTIONS_FETCHED: 'Wallet transactions fetched successfully',
  TRANSACTION_COMPLETED: 'Wallet transaction completed successfully',
  TRANSACTION_REVERSED: 'Wallet transaction reversed successfully',

  /* =======================
   * CREDIT / DEBIT
   * ======================= */
  CREDIT_INITIATED: 'Wallet credit initiated',
  CREDIT_SUCCESS: 'Wallet credited successfully',
  CREDIT_FAILED: 'Wallet credit failed',

  DEBIT_INITIATED: 'Wallet debit initiated',
  DEBIT_SUCCESS: 'Wallet debited successfully',
  DEBIT_FAILED: 'Wallet debit failed',

  /* =======================
   * WITHDRAWAL
   * ======================= */
  WITHDRAW_INITIATED: 'Withdrawal initiated',
  WITHDRAW_PENDING: 'Withdrawal is pending approval',
  WITHDRAW_SUCCESS: 'Withdrawal completed successfully',
  WITHDRAW_FAILED: 'Withdrawal failed',

  /* =======================
   * VALIDATION / BUSINESS ERRORS
   * ======================= */
  INVALID_TRANSACTION: 'Invalid wallet transaction',
  TRANSACTION_NOT_FOUND: 'Wallet transaction not found',
  DUPLICATE_TRANSACTION: 'Duplicate wallet transaction detected',
  TRANSACTION_ALREADY_PROCESSED: 'Wallet transaction already processed',
  TRANSACTION_NOT_ALLOWED: 'Wallet transaction not allowed',

  /* =======================
   * PAYMENT / GATEWAY
   * ======================= */
  PAYMENT_REFERENCE_REQUIRED: 'Payment reference is required',
  PAYMENT_VERIFICATION_FAILED: 'Payment verification failed',
  PAYMENT_MISMATCH: 'Payment amount mismatch',

  /* =======================
   * SYSTEM
   * ======================= */
  TRANSACTION_PENDING: 'Wallet transaction is pending',
  TRANSACTION_FAILED: 'Wallet transaction failed due to system error',

  /* =======================
   * OTHERS
   * ======================= */
  CREATE_FAILD: 'Faild to create transaction',
} as const;
