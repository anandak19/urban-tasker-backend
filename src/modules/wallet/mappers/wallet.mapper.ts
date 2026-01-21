import { WalletResponseDto } from '../dtos/wallet-response.dto';
import { WalletDocument } from '../schemas/wallet.schema';

export class WalletMapper {
  static toResponse(doc: WalletDocument): WalletResponseDto {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      currentBalance: doc.currentBalance,
      totalEarnings: doc.totalEarnings,
      totalWithdrawn: doc.totalWithdrawn,
      lastCreditAmount: doc.lastCreditAmount,
      lastDebitAmount: doc.lastDebitAmount,
      status: doc.status,
    };
  }
}
