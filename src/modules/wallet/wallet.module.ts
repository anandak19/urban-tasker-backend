import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { WALLET_TOKENS } from './wallet-tokens';
import { WalletRepository } from './repositories/wallet.repository';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from './schemas/wallet-transaction.schema';
import { WalletService } from './services/wallet/wallet.service';
import { WalletTransactionRepository } from './repositories/wallet-transaction.repository';
import { WalletController } from './controllers/wallet.controller';
import { WalletTransactionService } from './services/wallet-transaction/wallet-transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [
    { provide: WALLET_TOKENS.WALLET_REPOSITORY, useClass: WalletRepository },
    { provide: WALLET_TOKENS.WALLET_SERVICE, useClass: WalletService },
    {
      provide: WALLET_TOKENS.WALLET_TRANSACTION_REPOSITORY,
      useClass: WalletTransactionRepository,
    },
    {
      provide: WALLET_TOKENS.WALLET_TRANSACTION_SERVICE,
      useClass: WalletTransactionService,
    },
  ],
  exports: [WALLET_TOKENS.WALLET_SERVICE],
})
export class WalletModule {}
