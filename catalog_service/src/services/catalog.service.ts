import { ICatalogRepository } from '../interfaces/catalogRepository.inteface';

export class CatalogService {
  private repository: ICatalogRepository;
  constructor(repository: ICatalogRepository) {
    this.repository = repository;
  }

  async createProduct(input: any) {
    const data = await this.repository.create(input);

    if (!data.id) {
      throw new Error('unable to create product');
    }

    return data;
  }

  async updateProduct(input: any) {
    const data = await this.repository.update(input);

    if (!data.id) {
      throw new Error('unable to update product');
    }

    // emit event to update record in Elastic Search
    return data;
  }

  async getProducts(limit: number, offset: number) {
    // instead of this we will get from Elastic Search
    const products = await this.repository.find(limit, offset);
    return products;
  }

  async getProduct(id: number) {
    const product = await this.repository.findOne(id);
    return product;
  }

  async deleteProduct(id: number) {
    const deletedId = await this.repository.delete(id);
    return deletedId;
  }
}
