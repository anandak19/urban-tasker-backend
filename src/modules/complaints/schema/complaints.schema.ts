import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ComplaintStatus } from '@shared/constants/enums/complaint-status.enum';
import { generatePrefixedId } from '@shared/utility/unique-id/id-generator.util';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Complaint {
  @Prop({ default: () => generatePrefixedId('CMP'), index: true })
  cmpId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Task' })
  taskId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  text: string;

  // Store ONLY S3 keys
  @Prop({ type: [String], default: [] })
  imageKeys: string[];

  @Prop({
    required: false,
    enum: ComplaintStatus,
    default: ComplaintStatus.PENDING,
  })
  complaintStatus: ComplaintStatus;

  @Prop({ required: false })
  adminFeedback: string;

  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;

  //other fields
}

export type ComplaintDocument = HydratedDocument<Complaint>;
export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
