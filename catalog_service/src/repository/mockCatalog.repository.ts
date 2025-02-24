import { ICatalogRepository } from '../interfaces/catalogRepository.interface';
import { Product } from '../models/product.model';

export class MockCatalogRepository implements ICatalogRepository {
  create(data: Product): Promise<Product> {
    const mockProduct = {
      id: 1,
      ...data,
    };

    return Promise.resolve(mockProduct);
  }
  update(data: Product): Promise<Product> {
    return Promise.resolve(data);
  }
  delete(id: number): Promise<number> {
    return Promise.resolve(id);
  }
  find(limit: number, offset: number): Promise<Product[]> {
    return Promise.resolve([]);
  }
  findOne(id: number): Promise<Product> {
    return Promise.resolve({ id } as Product);
  }
  findStock(ids: number[]): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
}
