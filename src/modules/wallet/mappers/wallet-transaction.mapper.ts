import {
  DetaildWalletTransactionResponseDto,
  ListWalletTransactionResponseDto,
} from '../dtos/wallet-transaction-response.dto';
import { WalletTransactionDocument } from '../schemas/wallet-transaction.schema';

export class WalletTransactionMapper {
  static toDetaildResponse(
    doc: WalletTransactionDocument,
  ): DetaildWalletTransactionResponseDto {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      amount: doc.amount,
      type: doc.type,
      source: doc.source,
      balanceAfter: doc.balanceAfter,
      walletId: doc.walletId.toString(),
      isSuccess: doc.isSuccess,
    };
  }

  static toListResponse(
    doc: WalletTransactionDocument,
  ): ListWalletTransactionResponseDto {
    return {
      id: doc._id.toString(),
      amount: doc.amount,
      type: doc.type,
      source: doc.source,
      balanceAfter: doc.balanceAfter,
      isSuccess: doc.isSuccess,
    };
  }
}
