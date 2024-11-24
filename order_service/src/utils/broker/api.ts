import axios from 'axios';
import { AuthorizeError, NotFoundError } from '../error';
import { logger } from '../logger';
import { Product } from '../../dto/product.dto';
import { User } from '../../dto/user.dto';

const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || 'http://localhost:5000';

const AUTH_SERVICE_BASE_URL =
  process.env.AUTH_SERVICE_BASE_URL || 'http://localhost:9001';

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

export const GetStockDetails = async (ids: number[]) => {
  try {
    const response = await axios.post(`${CATALOG_BASE_URL}/product/stock`, {
      ids,
    });

    return response.data as Product[];
  } catch (error) {
    logger.error(error);
    throw new NotFoundError('Error on getting stock details');
  }
};

export const ValidateUser = async (token: string) => {
  try {
    axios.defaults.headers.common['Authorization'] = token;
    const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/auth/validate`);

    if (response.status !== 200) {
      throw new AuthorizeError('User not authorized');
    }

    return response.data as User;
  } catch (error) {
    throw new AuthorizeError('User not authorized');
  }
};
