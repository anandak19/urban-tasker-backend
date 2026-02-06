import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthProvider } from '@shared/constants/enums/auth-providers.enum';
import { Gender, UserRoles } from '@shared/constants/enums/user.enum';
import { HydratedDocument } from 'mongoose';
import { HomeAddress } from './home-address.schema';
import { ProfileImage } from './profile-image.schema';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  password: string;

  // optional props
  @Prop({ required: false })
  gender: Gender;

  @Prop({ required: false, default: UserRoles.USER })
  userRole: UserRoles;

  @Prop({ required: false })
  profileImage: ProfileImage; // value & source

  @Prop({ required: false, type: Boolean, default: false })
  isTaskerApplied: boolean;

  @Prop({ required: true, default: AuthProvider.LOCAL })
  provider: AuthProvider;

  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isSuspended: boolean;

  @Prop({ type: String, default: '' })
  suspendedReason: string;

  // to store the home address
  @Prop({ type: HomeAddress, required: false })
  homeAddress?: HomeAddress; // address, city, location(type, coordinates)
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ firstName: 'text', lastName: 'text' });
UserSchema.index({ 'homeAddress.location': '2dsphere' });
