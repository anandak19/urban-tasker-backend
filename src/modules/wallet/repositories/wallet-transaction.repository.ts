import { BaseRepository } from '@shared/repository/base.repository';
import {
  WalletTransaction,
  WalletTransactionDocument,
} from '../schemas/wallet-transaction.schema';
import { ICreateWalletTransaction } from '../interfaces/wallet-transactions.interface';
import { IWalletTransactionRepository } from '../interfaces/wallet-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletTransactionRepository
  extends BaseRepository<WalletTransactionDocument, ICreateWalletTransaction>
  implements IWalletTransactionRepository
{
  constructor(
    @InjectModel(WalletTransaction.name)
    private _walletTransaction: Model<WalletTransactionDocument>,
  ) {
    super(_walletTransaction);
  }

  //sample
  sample() {
    throw new Error('Method not implemented.');
  }
}
