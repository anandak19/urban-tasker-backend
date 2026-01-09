import { IProfileImage } from '@modules/users/interfaces/user.interface';
import { TObjectId } from '@shared/types/db-types';

export interface ICreateChat {
  participants: TObjectId[];
}

export interface IChat extends Omit<ICreateChat, 'participants'> {
  participants: string[];
  id: string;
  lastMessage: string;
}

export interface IChatPartnerBasic {
  firstName: string;
  lastName: string;
}

export interface IChatPartnerAggregationResult extends IChatPartnerBasic {
  profileImage?: IProfileImage;
  _id: TObjectId;
}

export interface IChatAggregationResult {
  _id: TObjectId; // chatId
  partner: IChatPartnerAggregationResult;
}
