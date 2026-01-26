import { Module } from '@nestjs/common';
import { REPORTS_TOKENS } from './reports-tokens';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/admin/reports.controller';
import { BookingsModule } from '@modules/bookings/bookings.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [BookingsModule, UsersModule],
  controllers: [ReportsController],
  providers: [{ provide: REPORTS_TOKENS.SERVICE, useClass: ReportsService }],
})
export class ReportsModule {}
