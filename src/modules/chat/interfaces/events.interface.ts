export interface ServerEvents {
  newMessage: (payload: { from: string; message: string }) => void;
}
