import { IMessage } from './message.interface';
import {
  IAnswerResponse,
  IIceCandidateResponse,
  IOfferResponse,
} from './video-chat.interface';

export interface ServerEvents {
  newMessage: (payload: IMessage) => void;
  messages: (payload: IMessage[]) => void;

  offer: (payload: IOfferResponse) => void;
  answer: (payload: IAnswerResponse) => void;
  iceCandidates: (payload: IIceCandidateResponse) => void;
}
