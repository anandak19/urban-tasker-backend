import { IsNotEmpty, IsString } from 'class-validator';

export class VarifyPaymentDto {
  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string;

  @IsNotEmpty()
  @IsString()
  razorpaySignature: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
