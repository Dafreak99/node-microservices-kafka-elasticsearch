import { OrderWithLineItems } from '../dto/orderRequest.dto';

export type OrderRepositoryType = {
  createOrder: (lineItem: OrderWithLineItems) => Promise<number>;
  findOrder: (customerId: number) => Promise<OrderWithLineItems | null>;
  updateOrder: (id: number, status: string) => Promise<OrderWithLineItems>;
  deleteOrder: (id: number) => Promise<Boolean>;
  findOrderByCustomerId: (customerId: number) => Promise<OrderWithLineItems[]>;
};

export const OrderRepository: OrderRepositoryType = {
  createOrder: function (lineItem: OrderWithLineItems): Promise<number> {
    throw new Error('Function not implemented.');
  },
  findOrder: function (customerId: number): Promise<OrderWithLineItems | null> {
    throw new Error('Function not implemented.');
  },
  updateOrder: function (
    id: number,
    status: string,
  ): Promise<OrderWithLineItems> {
    throw new Error('Function not implemented.');
  },
  deleteOrder: function (id: number): Promise<Boolean> {
    throw new Error('Function not implemented.');
  },
  findOrderByCustomerId: function (
    customerId: number,
  ): Promise<OrderWithLineItems[]> {
    throw new Error('Function not implemented.');
  },
};
