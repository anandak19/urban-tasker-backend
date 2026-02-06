import { AuthGuard } from '@core/guards/auth/auth.guard';
import type {
  IWalletService,
  IWalletTransactionService,
} from '@modules/wallet/interfaces/wallet-services.interface';
import { WALLET_TOKENS } from '@modules/wallet/wallet-tokens';
import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@UseGuards(AuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(
    @Inject(WALLET_TOKENS.WALLET_SERVICE)
    private _walletService: IWalletService,

    @Inject(WALLET_TOKENS.WALLET_TRANSACTION_SERVICE)
    private _walletTransactionService: IWalletTransactionService,
  ) {}

  // view wallet money details of logged in user
  @Get()
  findOneByUserId(@Request() req: IAuthenticatedReqeust) {
    return this._walletService.findOneByUserId(req.user.id);
  }

  // view wallet transactions
  @Get(':walletId')
  findAllByWalletId(
    @Param('walletId') walletId: string,
    @Query() query: GetDocsDto,
  ) {
    console.log('Called transacton history: ', walletId);

    return this._walletTransactionService.findAllByWalletId(walletId, query);
  }
}
