import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IComplaintService } from '../interfaces/complaints-services.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateComplaintDto } from '../dtos/create-complaint.dto';
import { COMPLIANTS_TOKENS } from '../complaints-token';
import type { IComplaintRepository } from '../interfaces/complaints-repositories.interfaces';
import { ICreateComplaint } from '../interfaces/complaints.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import type { IS3Service } from '@core/lib/s3/s3.interface';
import { ComplaintMapper } from '../mappers/complaint.mapper';
import { ComplaintDetailsResponseDto } from '../dtos/compliant-details-response.dto';
import { UuidService } from '@core/lib/uuid/uuid.service';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import type { IBookingService } from '@modules/bookings/interfaces/bookings-services.interface';

@Injectable()
export class ComplaintService implements IComplaintService {
  constructor(
    @Inject(COMPLIANTS_TOKENS.COMPLIANTS_REPOSITORY)
    private _complaintRepo: IComplaintRepository,

    @Inject(S3_SERVICE)
    private _s3Service: IS3Service,

    @Inject() private _uuiService: UuidService,

    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,
  ) {}

  async findOneById(complaintId: string): Promise<ComplaintDetailsResponseDto> {
    const complaint = await this._complaintRepo.findById(complaintId);

    if (!complaint) {
      throw new NotFoundException('Complaint Not Found');
    }

    const id = this._uuiService.generate();
    console.log('id');
    console.log(id);

    const imageUrls = complaint?.imageKeys.length
      ? await Promise.all(
          complaint.imageKeys.map((key) => this._s3Service.getImageUrl(key)),
        )
      : [];

    return ComplaintMapper.toComplaintDetailsResponse(complaint, imageUrls);
  }

  async findComplaintByTaskId(
    taskId: string,
  ): Promise<ComplaintDetailsResponseDto> {
    const complaint = await this._complaintRepo.findOne({
      taskId: toObjectId(taskId),
    });

    if (!complaint) {
      throw new NotFoundException('Complaint Not Found');
    }

    const imageUrls = complaint?.imageKeys.length
      ? await Promise.all(
          complaint.imageKeys.map((key) => this._s3Service.getImageUrl(key)),
        )
      : [];

    console.log(complaint);
    return ComplaintMapper.toComplaintDetailsResponse(complaint, imageUrls);
  }

  async createComplaint(
    taskId: string,
    userId: string,
    imageFiles: Express.Multer.File[],
    complaint: CreateComplaintDto,
  ): Promise<IBaseResponse> {
    const taskDetails = await this._bookingService.getBookingDetails(taskId);
    // validate inputs
    // upload images and get keys
    const imageKeys = imageFiles.length
      ? await Promise.all(
          imageFiles.map((file) => this._s3Service.uploadComplaintImage(file)),
        )
      : [];
    // create doc
    const newComplaint: ICreateComplaint = {
      taskId: toObjectId(taskId),
      taskerId: toObjectId(taskDetails.taskerId),
      createdBy: toObjectId(userId),
      imageKeys,
      text: complaint.complaint,
    };
    // create
    const saved = await this._complaintRepo.create(newComplaint);

    if (!saved) {
      throw new InternalServerErrorException('Faild to save complaint');
    }
    // return msg
    return { message: 'Complaint Created Succssfully' };
  }
}
