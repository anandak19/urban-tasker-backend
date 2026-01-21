import {
  WalletTransactionSource,
  WalletTransactionType,
} from '../constants/wallet.enums';

export class ListWalletTransactionResponseDto {
  id: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter?: number;
  source: WalletTransactionSource;
  isSuccess: boolean;
}

export class DetaildWalletTransactionResponseDto extends ListWalletTransactionResponseDto {
  walletId: string;
  userId: string;
}
