import { IUser } from "@/context/AuthContext";

export interface IOrder {
  _id: string;
  orderId: string;
  receiverPhone: string;
  receiverName: string;
  receiversAddress: string;
  descr: string;
  sender: IUser;
  status: string;
  paymentStatus: string;
  receiver?: IUser;
  timeOfArrival?: Date;
  cost: string;
  address: string;
  rider: IUser;
  gatewayPaymentId?: string;
  externalReference?: string;
  authorizationCode?: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface IWallet {
  balance: number;
  updatedAt: Date;
  createdAt: Date;
  rider: any;
}

export interface IWalletAndTransactions {
  orders: IOrder[];
  completedOrders: number;
  notDeliveredOrders: number;
  wallet: IWallet
}
