import { WALLET_CONSTANTS } from '@modules/wallet/constants/wallet.constants';
import { WALLET_MESSAGES } from '@modules/wallet/constants/wallet.messages';
import { WalletResponseDto } from '@modules/wallet/dtos/wallet-response.dto';
import type { IWalletRepository } from '@modules/wallet/interfaces/wallet-repositories.interface';
import { IWalletService } from '@modules/wallet/interfaces/wallet-services.interface';
import { WalletMapper } from '@modules/wallet/mappers/wallet.mapper';
import { WALLET_TOKENS } from '@modules/wallet/wallet-tokens';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class WalletService implements IWalletService {
  constructor(
    @Inject(WALLET_TOKENS.WALLET_REPOSITORY)
    private _walletRepo: IWalletRepository,
  ) {}

  // ~ NOT TESTED
  async create(userId: string): Promise<WalletResponseDto> {
    // check if exists
    const existingWallet = await this._walletRepo.findOne({
      userId: toObjectId(userId),
    });

    // if exists return that
    if (existingWallet) {
      return WalletMapper.toResponse(existingWallet);
    }

    const createdWallet = await this._walletRepo.create({
      userId: toObjectId(userId),
    });

    if (!createdWallet) {
      throw new InternalServerErrorException(
        WALLET_MESSAGES.WALLET_CREATE_FAILD,
      );
    }

    return WalletMapper.toResponse(createdWallet);
  }

  /**
   * READ METHODS
   */

  // ~ NOT TESTED
  async findOneByUserId(userId: string): Promise<WalletResponseDto> {
    const wallet = await this._walletRepo.findOne({
      userId: toObjectId(userId),
    });

    if (!wallet) {
      throw new NotFoundException(WALLET_MESSAGES.WALLET_NOT_FOUND);
    }

    return WalletMapper.toResponse(wallet);
  }

  // ~ NOT TESTED
  async findOneById(id: string): Promise<WalletResponseDto> {
    const wallet = await this._walletRepo.findById(id);

    if (!wallet) {
      throw new NotFoundException(WALLET_MESSAGES.WALLET_NOT_FOUND);
    }

    return WalletMapper.toResponse(wallet);
  }

  /**
   * UPDATE METHODS
   */

  // ~ NOT TESTED
  async creditAmountByUserId(
    userId: string,
    amount: number,
  ): Promise<WalletResponseDto> {
    this._validateAmount(amount);
    const wallet = await this.findOneByUserId(userId);

    if (!wallet) {
      throw new NotFoundException(WALLET_MESSAGES.WALLET_NOT_FOUND);
    }

    const updated = await this._walletRepo.creditAmountById(wallet.id, amount);

    if (!updated) {
      throw new InternalServerErrorException('Faild to credit amount');
    }

    return WalletMapper.toResponse(updated);
  }

  // ~ NOT TESTED
  async debitAmountByUserId(userId: string, amount: number): Promise<boolean> {
    this._validateDebitAmount(amount);

    const wallet = await this.findOneByUserId(userId);

    if (!wallet) {
      throw new NotFoundException(WALLET_MESSAGES.WALLET_NOT_FOUND);
    }

    const isUpdated = this._walletRepo.debitAmountById(wallet.id, amount);

    return isUpdated;
  }

  private _validateAmount(amount: number): void {
    if (amount < 1) {
      throw new BadRequestException(
        WALLET_MESSAGES.AMOUNT_MUST_BE_GREATER_THAN_ZERO,
      );
    }
  }

  private _validateDebitAmount(amount: number): void {
    this._validateAmount(amount);
    if (amount < WALLET_CONSTANTS.MIN_WITHDRAW_AMOUNT) {
      throw new BadRequestException(WALLET_MESSAGES.AMOUNT_BELOW_MIN_LIMIT);
    }

    if (amount > WALLET_CONSTANTS.MAX_WITHDRAW_AMOUNT) {
      throw new BadRequestException(WALLET_MESSAGES.AMOUNT_EXCEEDS_MAX_LIMIT);
    }
  }
}
