import { OrderLineItem } from '../db/schema/order';
import { OrderLineItemType, OrderWithLineItems } from '../dto/orderRequest.dto';
import { CartRepositoryType } from '../repository/cart.repository';
import { OrderRepositoryType } from '../repository/order.repository';
import { OrderStatus } from '../types';

export const CreateOrder = async (
  customerId: number,
  repo: OrderRepositoryType,
  cartRepo: CartRepositoryType,
) => {
  // find cart by customer id
  const cart = await cartRepo.findCart(customerId);

  if (!cart) {
    throw new Error('Cart not found');
  }

  // calculate total order amount
  let cartTotal = 0;

  // create order line items from cart items
  const orderLineItems: OrderLineItemType[] = cart.lineItems.map((item) => {
    cartTotal += item.qty * Number(item.price);

    return {
      productId: item.productId,
      qty: item.qty,
      price: item.price,
    } as OrderLineItemType;
  });

  const orderNumber = Math.floor(Math.random() * 1000000);

  // create order with line items
  const orderInput: OrderWithLineItems = {
    orderNumber,
    txnId: null,
    customerId,
    amount: cartTotal.toString(),
    orderItems: orderLineItems,
    status: OrderStatus.PENDING,
  };

  const order = await repo.createOrder(orderInput);
  await cartRepo.clearCartData(customerId);
  console.log('order here', order);

  // fire a message to subscription service [catalog service] to update stock
  // await repo.publishOrderEvent(order.id, OrderEvent.ORDER_CREATED);

  // return success message
  return {
    message: 'Order created successfully',
    orderNumber,
  };
};

export const UpdateOrder = async (
  orderId: number,
  status: OrderStatus,
  repo: OrderRepositoryType,
) => {
  await repo.updateOrder(orderId, status);

  // fire a message to subscription service [catalog service] to update stock
  // TODO: handle Kafka calls
  if (status === OrderStatus.CANCELLED) {
    // await repo.publishOrderEvent(orderId, OrderEvent.ORDER_CANCELLED);
  }

  return {
    message: 'Order updated successfully',
  };
};

export const GetOrder = async (orderId: number, repo: OrderRepositoryType) => {
  const order = await repo.findOrder(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};

export const GetOrders = async (userId: number, repo: OrderRepositoryType) => {
  const orders = await repo.findOrderByCustomerId(userId);

  if (Array.isArray(orders) && orders.length > 0) {
    return orders;
  } else {
    throw new Error('No orders found');
  }
};

export const DeleteOrder = async (
  orderId: number,
  repo: OrderRepositoryType,
) => {
  await repo.deleteOrder(orderId);
  return true;
};

export const GetOrdersByCustomerId = async (
  customerId: number,
  repo: OrderRepositoryType,
) => {
  return {};
};

export const HandleSubscription = async (message: any) => {
  // if (message.event === OrderEvent.ORDER_UPDATED) {
  // call create order
  // }
};
