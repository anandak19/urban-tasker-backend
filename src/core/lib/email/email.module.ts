import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigService and ConfigModule
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
