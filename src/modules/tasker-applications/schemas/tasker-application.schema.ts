import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IdProofSchema, type IdProofDocument } from './id-proof.schema';
import { TaskerApplicationStatus } from '@shared/constants/enums/status.enum';
import { User } from '@modules/users/schemas/user.schema';
import { SubCategory } from '@modules/categories/schemas/subcategories.schema';

@Schema({ timestamps: true })
export class TaskerApplication {
  @Prop({ required: true, ref: User.name })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ type: String })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  hourlyRate: number;

  @Prop({
    required: true,
    type: [{ type: mongoose.Types.ObjectId, ref: SubCategory.name }],
  })
  workCategories: mongoose.Types.ObjectId[];

  @Prop({ required: true, type: IdProofSchema })
  idProof: IdProofDocument;

  @Prop({ required: false, default: TaskerApplicationStatus.PENDING })
  applicationStatus: TaskerApplicationStatus;

  @Prop({ required: false })
  adminFeedback: string;

  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;
}

export type TaskerApplicationDocument = HydratedDocument<TaskerApplication>;
export const TaskerApplicationSchema =
  SchemaFactory.createForClass(TaskerApplication);
