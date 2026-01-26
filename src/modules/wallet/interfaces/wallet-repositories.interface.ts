import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { WalletDocument } from '../schemas/wallet.schema';
import { ICreateWallet } from './wallet.interface';
import { WalletTransactionDocument } from '../schemas/wallet-transaction.schema';
import { ICreateWalletTransaction } from './wallet-transactions.interface';

export interface IWalletRepository
  extends IBaseRepository<WalletDocument, ICreateWallet> {
  /**
   * Increments the wallet balance by the given amount.
   *
   * - Updates the current balance
   * - Updates total earnings
   * - Stores the last credited amount
   *
   * @param id - Wallet document ID
   * @param amount - Amount to be credited (positive number)
   * @returns Promise<WalletDocument> -
   */
  creditAmountById(id: string, amount: number): Promise<WalletDocument | null>;

  /**
   * Decrements the wallet balance by the given amount.
   *
   * - Updates the current balance
   * - Updates total withdrawn
   * - Stores the last debited amount
   *
   * @param id - Wallet document ID
   * @param amount - Amount to be debited (positive number)
   * @returns Promise<boolean> - true if the update was successful
   */
  debitAmountById(id: string, amount: number): Promise<boolean>;
}

export interface IWalletTransactionRepository
  extends IBaseRepository<WalletTransactionDocument, ICreateWalletTransaction> {
  sample();
}
