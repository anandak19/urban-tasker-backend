import { TObjectId } from '@shared/types/db-types';
import { WalletStatus } from '../constants/wallet.enums';

export interface ICreateWallet {
  userId: TObjectId;
}

export interface IWallet {
  userId: string;
  currentBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  lastCreditAmount: number;
  lastDebitAmount: number;
  status: WalletStatus;
}
