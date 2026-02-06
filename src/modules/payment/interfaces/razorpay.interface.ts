export interface IRazorpayOrderResponse {
  orderId: string;
  userId: string;
  amountToPaidInMinorUnits: number;
  currency: string;
  status: string;
  receipt?: string;
  //update this later
}

export interface IRazorpayOrderVarificationResponse {
  isPaid: boolean; //change this later
}

export interface IRazorpayNotes {
  userId: string;
  userEmail: string;
}
