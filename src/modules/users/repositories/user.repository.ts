import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { IUser, IUserEntity } from '../interfaces/user.interface';
import { isDuplicateKeyError } from '@shared/utility/db/mongo-error.util';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { HashService } from '@core/lib/hash/hash.service';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private _hashService: HashService,
  ) {}

  // To create a new user to db
  // return type = mongoose doc
  async create(data: IUser): Promise<UserDocument> {
    try {
      const hashedPassword = await this._hashService.hashPassword(
        data.password,
      ); // change to hashed password later
      const newUser = new this.userModel({
        ...data,
        password: hashedPassword,
      });
      return await newUser.save();
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException(AUTH_MESSAGES.EMAIL_TAKEN);
      }
      throw error;
    }
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async findOne(filter: Partial<IUserEntity>): Promise<UserDocument | null> {
    return await this.userModel.findOne(filter).exec();
  }
}
