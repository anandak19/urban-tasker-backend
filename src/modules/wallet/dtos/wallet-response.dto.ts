import { WalletStatus } from '../constants/wallet.enums';

export class WalletResponseDto {
  id: string;
  userId: string;
  currentBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  lastCreditAmount: number;
  lastDebitAmount: number;
  status: WalletStatus;
}
