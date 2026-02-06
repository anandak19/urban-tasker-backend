import { TObjectId } from '@shared/types/db-types';
import {
  WalletTransactionSource,
  WalletTransactionType,
} from '../constants/wallet.enums';

export interface ICreateWalletTransaction {
  walletId: TObjectId;
  userId: TObjectId;
  type: WalletTransactionType;
  amount: number;
  source: WalletTransactionSource;
  referenceId?: string;
}
