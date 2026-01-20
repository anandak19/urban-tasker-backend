export interface IUserInfo {
  id: string;
  name?: string;
}

export interface IOfferTo {
  offer: RTCSessionDescriptionInit;
  to: IUserInfo;
}

export interface IOfferFrom extends Pick<IOfferTo, 'offer'> {
  from: IUserInfo;
}

export interface IAnswerPayload {
  answer: RTCSessionDescriptionInit;
  to: string;
}

export interface IAnswerResponse extends Pick<IAnswerPayload, 'answer'> {
  from: string;
}

export interface ICallRejectFrom {
  from: string;
}

export interface ICallRejectTo {
  to: string;
}

export interface ICallHangupTo {
  to: IUserInfo;
}

export interface ICallHangupFrom {
  from: IUserInfo;
}

export interface IIceCandidatePayload {
  candidate: RTCIceCandidateInit;
  to: string;
}

export interface IIceCandidateResponse
  extends Pick<IIceCandidatePayload, 'candidate'> {
  from: string;
}
