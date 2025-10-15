import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { IUserEntity } from '../interfaces/user.interface';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // To create a new user to db
  // return type = mongoose doc
  async create(data: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(data);
    const savedUser = await newUser.save();
    return savedUser; // the service will convert the this to plain object using mapper
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async findOne(filter: Partial<IUserEntity>): Promise<UserDocument | null> {
    return await this.userModel.findOne(filter).exec();
  }
}
