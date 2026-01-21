export const WALLET_MESSAGES = {
  /* =======================
   * SUCCESS MESSAGES
   * ======================= */
  WALLET_CREATED: 'Wallet created successfully',
  WALLET_FETCHED: 'Wallet details fetched successfully',
  CREDIT_SUCCESS: 'Amount credited to wallet',
  DEBIT_SUCCESS: 'Amount debited from wallet',
  WITHDRAW_REQUEST_CREATED: 'Withdraw request created successfully',
  WITHDRAW_SUCCESS: 'Withdrawal completed successfully',

  /* =======================
   * VALIDATION ERRORS
   * ======================= */
  INVALID_AMOUNT: 'Invalid amount',
  AMOUNT_MUST_BE_GREATER_THAN_ZERO: 'Amount must be greater than zero',
  AMOUNT_BELOW_MIN_LIMIT: 'Amount is below the minimum withdrawal limit',
  AMOUNT_EXCEEDS_MAX_LIMIT: 'Amount exceeds the maximum withdrawal limit',
  INVALID_TRANSACTION_TYPE: 'Invalid wallet transaction type',

  /* =======================
   * BUSINESS LOGIC ERRORS
   * ======================= */
  WALLET_NOT_FOUND: 'Wallet not found',
  INSUFFICIENT_BALANCE: 'Insufficient wallet balance',
  WALLET_BLOCKED: 'Wallet is blocked',
  WALLET_ALREADY_EXISTS: 'Wallet already exists for this user',
  TRANSACTION_NOT_FOUND: 'Wallet transaction not found',

  /* =======================
   * PAYMENT / TRANSACTION ERRORS
   * ======================= */
  TRANSACTION_FAILED: 'Wallet transaction failed',
  TRANSACTION_PENDING: 'Wallet transaction is pending',
  DUPLICATE_TRANSACTION: 'Duplicate wallet transaction detected',
  PAYMENT_VERIFICATION_FAILED: 'Payment verification failed',

  /* =======================
   * AUTH / ACCESS ERRORS
   * ======================= */
  UNAUTHORIZED_WALLET_ACCESS: 'You are not authorized to access this wallet',
  FORBIDDEN_WALLET_OPERATION: 'You are not allowed to perform this operation',

  /* =======================
   * SYSTEM / SERVER ERRORS
   * ======================= */
  WALLET_CREATE_FAILD: 'Faild to create wallet',
  WALLET_SERVICE_UNAVAILABLE: 'Wallet service is temporarily unavailable',
} as const;
