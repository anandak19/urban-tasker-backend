import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@config/app.config';

export const RAZORPAY_CLIENT = 'RAZORPAY_CLIENT';

export const RazorpayProvider = {
  provide: RAZORPAY_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService<AppConfig>) => {
    return new Razorpay({
      key_id: configService.get('RAZORPAY_API_KEY', { infer: true })!,
      key_secret: configService.get('RAZORPAY_KEY_SECREAT', { infer: true })!,
    });
  },
};
