import { BaseRepository } from '@shared/repository/base.repository';
import { Wallet, WalletDocument } from '../schemas/wallet.schema';
import { ICreateWallet } from '../interfaces/wallet.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, UpdateQuery } from 'mongoose';
import { IWalletRepository } from '../interfaces/wallet-repositories.interface';

@Injectable()
export class WalletRepository
  extends BaseRepository<WalletDocument, ICreateWallet>
  implements IWalletRepository
{
  constructor(
    @InjectModel(Wallet.name) private _walletModal: Model<WalletDocument>,
  ) {
    super(_walletModal);
  }

  // ~ NOT TESTED
  async creditAmountById(id: string, amount: number): Promise<boolean> {
    const update: UpdateQuery<WalletDocument> = {
      $set: {
        lastCreditAmount: amount,
      },
      $inc: {
        currentBalance: amount,
        totalEarnings: amount,
      },
    };
    const result = await this.updateById(id, update);

    return result ? true : false;
  }

  // ~ NOT TESTED
  async debitAmountById(id: string, amount: number): Promise<boolean> {
    const update: UpdateQuery<WalletDocument> = {
      $set: {
        lastDebitAmount: amount,
      },
      $inc: {
        currentBalance: -amount,
        totalWithdrawn: amount,
      },
    };

    const result = await this.updateById(id, update);

    return result ? true : false;
  }
}
