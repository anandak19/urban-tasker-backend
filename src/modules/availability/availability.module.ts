import { Module } from '@nestjs/common';
import { AVAILABILITY_TOKEN } from './availability.token';
import { AvailabilityRepository } from './repositories/availability.repository';
import { AvailabilityService } from './services/availability.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Availability,
  AvailabilitySchema,
} from './schemas/availability.schema';
import { AvailabilityController } from './controllers/availability.controller';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
    ]),
    AuthModule,
  ],
  controllers: [AvailabilityController],
  providers: [
    {
      provide: AVAILABILITY_TOKEN.AVAILABILITY_REPOSITORY,
      useClass: AvailabilityRepository,
    },
    {
      provide: AVAILABILITY_TOKEN.AVAILABILITY_SERVICE,
      useClass: AvailabilityService,
    },
  ],
  exports: [AVAILABILITY_TOKEN.AVAILABILITY_SERVICE],
})
export class AvailabilityModule {}
