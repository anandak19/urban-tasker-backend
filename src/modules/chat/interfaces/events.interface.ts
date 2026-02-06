import { IMessage } from './message.interface';
import {
  IAnswerResponse,
  ICallHangupFrom,
  ICallRejectFrom,
  IFromData,
  IIceCandidateResponse,
  IOfferFrom,
} from './video-chat.interface';

// events emited by server
export interface ServerEvents {
  newMessage: (payload: IMessage) => void;
  messages: (payload: IMessage[]) => void;

  offer: (payload: IOfferFrom) => void;
  answer: (payload: IAnswerResponse) => void;
  iceCandidates: (payload: IIceCandidateResponse) => void;
  callReject: (payload: ICallRejectFrom) => void;
  callHangup: (payload: ICallHangupFrom) => void;

  userBusy: (payload: IFromData) => void;
}
