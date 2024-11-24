import { Static, Type } from '@sinclair/typebox';
import { Cart, CartLineItem } from '../db/schema';

export const CartRequestSchema = Type.Object({
  productId: Type.Integer(),
  qty: Type.Integer(),
});

export type CartRequestInput = Static<typeof CartRequestSchema>;

export const CartEditRequestSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});

export type CartEditRequestInput = Static<typeof CartEditRequestSchema>;

export interface CartLineItemWithAvailability extends CartLineItem {
  availability?: number;
}

export interface CartWithLineItems extends Cart {
  lineItems: CartLineItemWithAvailability[];
}
