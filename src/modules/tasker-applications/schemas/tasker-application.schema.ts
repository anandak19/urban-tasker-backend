import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IdProofSchema, type IdProofDocument } from './id-proof.schema';

@Schema()
export class TaskerApplication {
  @Prop({ type: String })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  hourlyRate: number;

  @Prop({ required: true })
  workCategories: mongoose.Types.ObjectId[];

  @Prop({ required: true, type: IdProofSchema })
  idProof: IdProofDocument;
}

export type TaskerApplicationDocument = HydratedDocument<TaskerApplication>;
export const TaskerApplicationSchema =
  SchemaFactory.createForClass(TaskerApplication);
