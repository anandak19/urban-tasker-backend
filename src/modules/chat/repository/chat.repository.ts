import { BaseRepository } from '@shared/repository/base.repository';
import { Chat, ChatDocument } from '../schema/chat.schema';
import {
  IChatAggregationResult,
  ICreateChat,
} from '../interfaces/chat.interface';
import { Model } from 'mongoose';
import { IChatRepositories } from '../interfaces/chat-repositories.interface';
import { TObjectId } from '@shared/types/db-types';
import { InjectModel } from '@nestjs/mongoose';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

export class ChatRepository
  extends BaseRepository<ChatDocument, ICreateChat>
  implements IChatRepositories
{
  constructor(@InjectModel(Chat.name) private _chatModal: Model<ChatDocument>) {
    super(_chatModal);
  }

  //public methods
  async findOneByParticipantsIds(
    participants: TObjectId[],
  ): Promise<ChatDocument | null> {
    return await this.findOne({
      participants: { $all: participants, $size: 2 },
    });
  }

  async findOneByIdAndUserId(
    id: string,
    myId: string,
  ): Promise<IChatAggregationResult> {
    const userObjectId = toObjectId(myId);

    const [result] = await this._chatModal.aggregate<IChatAggregationResult>([
      {
        $match: {
          _id: toObjectId(id),
        },
      },
      {
        $addFields: {
          partnerId: {
            $first: {
              $filter: {
                input: '$participants',
                as: 'id',
                cond: { $ne: ['$$id', userObjectId] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'partnerId',
          foreignField: '_id',
          as: 'partner',
        },
      },
      {
        $unwind: '$partner',
      },
      {
        $project: {
          _id: 1,
          'partner._id': 1,
          'partner.firstName': 1,
          'partner.lastName': 1,
          'partner.profileImage': 1,
        },
      },
    ]);

    return result;
  }

  async findAllUserChats(userId: string): Promise<IChatAggregationResult[]> {
    const userObjectId = toObjectId(userId);
    const result = await this._chatModal.aggregate<IChatAggregationResult>([
      {
        $match: {
          participants: userObjectId,
        },
      },
      {
        $addFields: {
          partnerId: {
            $first: {
              $filter: {
                input: '$participants',
                as: 'id',
                cond: { $ne: ['$$id', userObjectId] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'partnerId',
          foreignField: '_id',
          as: 'partner',
        },
      },
      {
        $unwind: '$partner',
      },
      {
        $project: {
          _id: 1,
          'partner._id': 1,
          'partner.firstName': 1,
          'partner.lastName': 1,
          'partner.profileImage': 1,
        },
      },
    ]);

    return result;
  }

  //private methods
}
