import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class IdProof {
  @Prop({ required: true })
  idProofType: string;

  @Prop({ required: true })
  frontImage: string;

  @Prop({ required: true })
  backImage: string;
}

export type IdProofDocument = HydratedDocument<IdProof>;
export const IdProofSchema = SchemaFactory.createForClass(IdProof);
