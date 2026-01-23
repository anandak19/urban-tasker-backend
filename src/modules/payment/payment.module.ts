import { RazorpayProvider } from '@config/razorpay/razorpay.provider';
import { Module } from '@nestjs/common';
import { PAYMENT_TOKENS } from './payment.token';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { BookingsModule } from '@modules/bookings/bookings.module';
import { TaskerModule } from '@modules/tasker/tasker.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { PaymentRepository } from './repositories/payment.repository';
import { WalletModule } from '@modules/wallet/wallet.module';

@Module({
  imports: [
    BookingsModule,
    TaskerModule,
    WalletModule,
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  controllers: [PaymentController],
  providers: [
    RazorpayProvider,
    {
      provide: PAYMENT_TOKENS.PAYMENT_SERVICE,
      useClass: PaymentService,
    },
    {
      provide: PAYMENT_TOKENS.PAYMENT_REPOSITORY,
      useClass: PaymentRepository,
    },
  ],
  exports: [RazorpayProvider, PAYMENT_TOKENS.PAYMENT_SERVICE],
})
export class PaymentModule {}
