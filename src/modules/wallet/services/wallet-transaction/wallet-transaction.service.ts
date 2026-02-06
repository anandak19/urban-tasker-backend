import { WALLET_TRANSACTION_MESSAGES } from '@modules/wallet/constants/wallet-transaction.messages';
import {
  DetaildWalletTransactionResponseDto,
  ListWalletTransactionResponseDto,
} from '@modules/wallet/dtos/wallet-transaction-response.dto';
import type { IWalletTransactionRepository } from '@modules/wallet/interfaces/wallet-repositories.interface';
import { IWalletTransactionService } from '@modules/wallet/interfaces/wallet-services.interface';
import { ICreateWalletTransaction } from '@modules/wallet/interfaces/wallet-transactions.interface';
import { WalletTransactionMapper } from '@modules/wallet/mappers/wallet-transaction.mapper';
import { WALLET_TOKENS } from '@modules/wallet/wallet-tokens';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { ClientSession } from 'mongoose';

@Injectable()
export class WalletTransactionService implements IWalletTransactionService {
  constructor(
    @Inject(WALLET_TOKENS.WALLET_TRANSACTION_REPOSITORY)
    private _walletTransactionRepo: IWalletTransactionRepository,
  ) {}

  // internal
  async create(
    data: ICreateWalletTransaction,
    session: ClientSession,
  ): Promise<DetaildWalletTransactionResponseDto> {
    const createdData = await this._walletTransactionRepo.create(data, session);

    if (!createdData) {
      throw new InternalServerErrorException(
        WALLET_TRANSACTION_MESSAGES.CREATE_FAILD,
      );
    }

    return WalletTransactionMapper.toDetaildResponse(createdData);
  }

  // ~ NOT TESTED
  async findAllByWalletId(
    walletId: string,
    query: IFindAllQuery,
  ): Promise<PaginatedResult<ListWalletTransactionResponseDto>> {
    const option: IFindAllOptions = {
      limit: query.limit,
      page: query.page,
    };

    const filter = {
      walletId: toObjectId(walletId),
    };

    const result = await this._walletTransactionRepo.findAll(option, filter); // override the mehtod for new return type/ projection type

    const documents = result.documents.map((item) =>
      WalletTransactionMapper.toListResponse(item),
    );

    return {
      documents,
      meta: result.meta,
    };
  }
}
