import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { WalletResponseDto } from '../dtos/wallet-response.dto';
import {
  DetaildWalletTransactionResponseDto,
  ListWalletTransactionResponseDto,
} from '../dtos/wallet-transaction-response.dto';
import { ICreateWalletTransaction } from './wallet-transactions.interface';

export interface IWalletService {
  /**
   * Creates a new wallet for a given user.
   *
   * This method is typically called when a user is registered
   * or when the wallet feature is first initialized for the user.
   *
   * @param userId - Unique identifier of the user
   * @returns WalletResponseDto containing the newly created wallet details
   */
  create(userId: string): Promise<WalletResponseDto>;

  /**
   * Retrieves the wallet associated with a specific user.
   *
   * This is commonly used to display wallet information
   * such as current balance, total earnings, and withdrawals
   * on the user dashboard.
   *
   * @param userId - Unique identifier of the user
   * @returns WalletResponseDto of the user's wallet
   * @throws NotFoundException if the wallet does not exist
   */
  findOneByUserId(userId: string): Promise<WalletResponseDto>;

  /**
   * Retrieves a wallet by its wallet ID.
   *
   * This method is mainly used for internal operations,
   * admin access, or transaction-level validations.
   *
   * @param id - Unique identifier of the wallet
   * @returns WalletResponseDto of the wallet
   * @throws NotFoundException if the wallet is not found
   */
  findOneById(id: string): Promise<WalletResponseDto>;

  /**
   * Credits a specified amount to the user's wallet.
   *
   * - Finds the wallet associated with the given user ID
   * - Adds the amount to the current balance
   * - Updates total earnings and last credit amount
   *
   * @param userId - Unique identifier of the user
   * @param amount - Amount to be credited to the wallet (must be > 0)
   * @returns Promise<boolean> - Returns true if the credit operation succeeds
   *                            Returns false if the operation fails
   */
  creditAmountByUserId(userId: string, amount: number): Promise<boolean>;

  /**
   * Debits a specified amount from the user's wallet.
   *
   * - Finds the wallet associated with the given user ID
   * - Validates sufficient wallet balance
   * - Deducts the amount from the current balance
   * - Updates total withdrawn and last debit amount
   *
   * @param userId - Unique identifier of the user
   * @param amount - Amount to be debited from the wallet (must be > 0)
   * @throws Error if wallet is not found or balance is insufficient
   * @returns Promise<boolean> - Returns true if the debit operation succeeds
   *                            Returns false if the operation fails
   */
  debitAmountByUserId(userId: string, amount: number): Promise<boolean>;
}

export interface IWalletTransactionService {
  /**
   * Creates a new wallet transaction record.
   *
   * @param data - Wallet transaction creation payload
   * @returns Detailed wallet transaction response
   */
  create(
    data: ICreateWalletTransaction,
  ): Promise<DetaildWalletTransactionResponseDto>;

  /**
   * Retrieves wallet transactions for a given wallet with pagination.
   *
   * @param walletId - Wallet identifier
   * @param query - Pagination and filter parameters
   * @returns Paginated list of wallet transactions
   */
  findAllByWalletId(
    walletId: string,
    query: IFindAllQuery,
  ): Promise<PaginatedResult<ListWalletTransactionResponseDto>>;
}
