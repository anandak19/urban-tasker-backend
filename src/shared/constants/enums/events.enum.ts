export enum CHAT_CLIENT_EVENTS {
  SEND_MESSAGE = 'sendMessage',
  JOIN_CHAT = 'joinChat',
  READ_MESSAGE = 'readMessage',
  GET_ALL_MESSAGES = 'getAllMessages',

  OFFER_ARRIVED = 'offer',
}

export enum CHAT_SERVER_EVENTS {
  NEW_MESSAGE = 'newMessage',
}
