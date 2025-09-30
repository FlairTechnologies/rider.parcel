export type ParcelStatus =
  | "cancelled"
  | "transit"
  | "pending"
  | "accepted"
  | "delivered";
type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Parcel {
  sender: string;
  descr: string;
  status: ParcelStatus;
  paymentStatus: PaymentStatus;
  receiverName: string;
  receiverPhone: string;
  receiversAddress: string;
  cost: string;
  address: string;
  _id: string;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  orderId: string;
}
