import { Order, OrderLineItem } from '../db/schema/order';

export type OrderLineItemType = OrderLineItem & {
  productId: number;
};

// export interface OrderWithLineItems extends Order {
//   orderItems: OrderLineItemType[];
//   orderNumber: number;
// }

export interface OrderWithLineItems {
  id?: number;
  customerId: number;
  orderNumber: number;
  txnId: string | null;
  amount: string;
  orderItems: OrderLineItemType[];
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
