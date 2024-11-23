import axios from 'axios';
import { APIError, NotFoundError } from '../error';
import { logger } from '../logger';
import { Product } from '../../dto/product.dto';

const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || 'http://localhost:5000';

export const GetProductDetails = async (productId: number) => {
  try {
    const response = await axios.get(
      `${CATALOG_BASE_URL}/product/${productId}`,
    );

    return response.data as Product;
  } catch (error) {
    logger.error(error);
    throw new NotFoundError('Product not found');
  }
};
