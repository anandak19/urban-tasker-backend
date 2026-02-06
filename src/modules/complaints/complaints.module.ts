import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Complaint, ComplaintSchema } from './schema/complaints.schema';
import { ComplaintsController } from './controllers/user/complaints.controller';
import { AdminComplaintsController } from './controllers/admin/admin-complaints.controller';
import { COMPLIANTS_TOKENS } from './complaints-token';
import { ComplaintService } from './services/complaint.service';
import { S3Module } from '@core/lib/s3/s3.module';
import { ComplaintRepository } from './repositories/complaint.repository';
import { AdminComplaintService } from './services/admin-complaint/admin-complaint.service';
import { UuidModule } from '@core/lib/uuid/uuid.module';
import { BookingsModule } from '@modules/bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintSchema },
    ]),
    S3Module,
    UuidModule,
    BookingsModule,
  ],
  controllers: [ComplaintsController, AdminComplaintsController],
  providers: [
    {
      provide: COMPLIANTS_TOKENS.COMPLIANTS_SERVICE,
      useClass: ComplaintService,
    },
    {
      provide: COMPLIANTS_TOKENS.ADMIN_COMPLIANTS_SERVICE,
      useClass: AdminComplaintService,
    },
    {
      provide: COMPLIANTS_TOKENS.COMPLIANTS_REPOSITORY,
      useClass: ComplaintRepository,
    },
  ],
})
export class ComplaintsModule {}
