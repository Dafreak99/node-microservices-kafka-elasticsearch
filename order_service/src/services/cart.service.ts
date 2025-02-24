import { CartLineItem } from '../db/schema';
import { CartEditRequestInput, CartRequestInput } from '../dto/cartRequest.dto';
import { CartRepositoryType } from '../repository/cart.repository';
import { AuthorizeError, logger, NotFoundError } from '../utils';
import { GetProductDetails, GetStockDetails } from '../utils/broker';

export const CreateCart = async (
  input: CartRequestInput & { customerId: number },
  repo: CartRepositoryType,
) => {
  // get product details from catalog service
  const product = await GetProductDetails(input.productId);
  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError('Product is out of stock');
  }

  // find if the product is already in the cart
  const lineItem = await repo.findCartByProductId(input.customerId, product.id);

  if (lineItem) {
    // if the product is already in the cart, update the quantity
    return repo.updateCart(lineItem.id, lineItem.qty + input.qty);
  }

  return await repo.createCart(input.customerId, {
    productId: product.id,
    price: product.price.toString(),
    qty: input.qty,
    itemName: product.name,
    variant: product.variant,
  } as CartLineItem);
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  // get customer cart data
  const cart = await repo.findCart(id);

  if (!cart) {
    throw new NotFoundError('Cart does not exist');
  }

  // list out all line items in the cart
  const { lineItems = [] } = cart || {};

  if (!lineItems.length) {
    throw new NotFoundError('Cart item not found');
  }

  /**
   * verify with inventory service if the product is still available
   * cart item can be added long time ago so the quantity of it can be outdated (out of stock)
   */
  const stockDetails = await GetStockDetails(
    lineItems.map((item) => item.productId),
  );

  if (Array.isArray(stockDetails)) {
    // update the stock availability in the cart line items
    lineItems.forEach((lineItem) => {
      const stockItem = stockDetails.find(
        (stock) => stock.id === lineItem.productId,
      );

      if (stockItem) {
        lineItem.availability = stockItem.stock;
      }
    });

    cart.lineItems = lineItems;
  }

  // return updated cart data with latest stock availability
  return cart;
};

const AuthorizedCart = async (
  lineItemId: number,
  customerId: number,
  repo: CartRepositoryType,
) => {
  const cart = await repo.findCart(customerId);

  if (!cart) {
    throw new NotFoundError('Cart does not exist');
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);

  if (!lineItem) {
    throw new AuthorizeError('You are not authorized to edit this cart');
  }

  return lineItem;
};

export const EditCart = async (
  input: CartEditRequestInput & { customerId: number },
  repo: CartRepositoryType,
) => {
  await AuthorizedCart(input.id, input.customerId, repo);
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (
  input: { id: number; customerId: number },
  repo: CartRepositoryType,
) => {
  await AuthorizedCart(input.id, input.customerId, repo);
  const data = await repo.deleteCart(input.id);
  return data;
};
