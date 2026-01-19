export interface IOfferPayload {
  offer: RTCSessionDescriptionInit;
  to: string;
}

export interface IOfferResponse extends Pick<IOfferPayload, 'offer'> {
  from: string;
}

export interface IAnswerPayload {
  answer: RTCSessionDescriptionInit;
  to: string;
}

export interface IAnswerResponse extends Pick<IAnswerPayload, 'answer'> {
  from: string;
}

export interface IIceCandidatePayload {
  candidate: RTCIceCandidateInit;
  to: string;
}

export interface IIceCandidateResponse
  extends Pick<IIceCandidatePayload, 'candidate'> {
  from: string;
}
