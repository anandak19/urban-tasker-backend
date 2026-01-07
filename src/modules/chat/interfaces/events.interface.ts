import { IMessage } from './message.interface';

export interface ServerEvents {
  newMessage: (payload: IMessage) => void;
  messages: (payload: IMessage[]) => void;
}
