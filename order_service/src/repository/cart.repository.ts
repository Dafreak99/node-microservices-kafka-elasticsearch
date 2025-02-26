import { eq } from 'drizzle-orm';
import { DB } from '../db/db.connection';
import { Cart, CartLineItem, cartLineItems, carts } from '../db/schema';
import { NotFoundError } from '../utils';
import { CartWithLineItems } from '../dto/cartRequest.dto';

// declare repository type
export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
  findCart: (customerId: number) => Promise<CartWithLineItems>;
  updateCart: (id: number, qty: number) => Promise<CartLineItem>;
  deleteCart: (id: number) => Promise<Boolean>;
  clearCartData: (customerId: number) => Promise<Boolean>;
  findCartByProductId: (
    customerId: number,
    productId: number,
  ) => Promise<CartLineItem>;
};

const createCart = async (customerId: number, lineItem: CartLineItem) => {
  // connect to db
  const result = await DB.insert(carts)
    .values({
      customerId,
    })
    .returning()
    .onConflictDoUpdate({
      target: carts.customerId,
      set: { updatedAt: new Date() },
    });

  const [{ id }] = result;

  if (id > 0) {
    const { itemName, price, productId, qty, variant } = lineItem;

    await DB.insert(cartLineItems).values({
      cartId: id,
      productId,
      itemName,
      price,
      qty,
      variant,
    });
  }

  return id;
};

const findCart = async (customerId: number): Promise<CartWithLineItems> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, customerId),
    with: {
      lineItems: true,
    },
  });

  if (!cart) {
    throw new NotFoundError('cart not found');
  }

  return cart;
};

const updateCart = async (id: number, qty: number): Promise<CartLineItem> => {
  const [cartLineItem] = await DB.update(cartLineItems)
    .set({
      qty: qty,
    })
    .where(eq(cartLineItems.id, id))
    .returning();
  return cartLineItem;
};

const deleteCart = async (id: number): Promise<boolean> => {
  await DB.delete(cartLineItems).where(eq(cartLineItems.id, id)).returning();
  return true;
};

const clearCartData = async (customerId: number): Promise<boolean> => {
  await DB.delete(carts).where(eq(carts.id, customerId)).returning();
  return true;
};

const findCartByProductId = async (
  customerId: number,
  productId: number,
): Promise<CartLineItem> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, customerId),
    with: {
      lineItems: true,
    },
  });

  const lineItem = cart?.lineItems.find((item) => item.productId === productId);

  return lineItem as CartLineItem;
};

export const CartRepository: CartRepositoryType = {
  createCart,
  findCart,
  updateCart,
  deleteCart,
  clearCartData,
  findCartByProductId,
};
