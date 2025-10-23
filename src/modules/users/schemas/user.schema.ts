import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender, UserRoles } from '@shared/constants/enums/user.enum';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  // optional props
  @Prop({ required: false })
  gender?: Gender;

  @Prop({ required: false, default: UserRoles.USER })
  userRole?: UserRoles;

  @Prop({ required: false })
  profileImageUrl?: string;

  @Prop({ required: false, type: Boolean, default: false })
  isTaskerApplied?: boolean;

  @Prop({ required: false, type: Boolean, default: false })
  isDeleted?: boolean;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
