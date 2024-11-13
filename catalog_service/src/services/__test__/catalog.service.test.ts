import { ICatalogRepository } from '../../interfaces/catalogRepository.inteface';
import { Product } from '../../models/product.model';
import { MockCatalogRepository } from '../../repository/mockCatalog.repository';
import { ProductFactory } from '../../utils/fixtures';
import { CatalogService } from '../catalog.service';
import { faker } from '@faker-js/faker';

const mockProduct = (rest: any) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 10, max: 100 }),
    ...rest,
  };
};

describe('catalog service', () => {
  let repository: ICatalogRepository;
  let service: CatalogService;

  beforeEach(() => {
    repository = new MockCatalogRepository();
    service = new CatalogService(repository);
  });
  afterEach(() => {
    repository = {} as MockCatalogRepository;
  });

  describe('createProduct', () => {
    test('should create product', async () => {
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
      });

      const result = await service.createProduct(reqBody);

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test('should throw error with unable to create product', async () => {
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
      });

      jest
        .spyOn(repository, 'create')
        .mockImplementationOnce(() => Promise.resolve({} as Product));

      await expect(service.createProduct(reqBody)).rejects.toThrowError(
        'unable to create product',
      );
    });

    test('should throw error with product already exist', async () => {
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
      });

      jest
        .spyOn(repository, 'create')
        .mockImplementationOnce(() =>
          Promise.reject(new Error('product already exist')),
        );

      await expect(service.createProduct(reqBody)).rejects.toThrowError(
        'product already exist',
      );
    });
  });

  describe('updateProduct', () => {
    test('should update product', async () => {
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
        id: faker.number.int({ min: 10, max: 1000 }),
      });

      const result = await service.updateProduct(reqBody);

      expect(result).toMatchObject(reqBody);
    });

    test('should throw error with product does not exist', async () => {
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
        id: faker.number.int({ min: 10, max: 1000 }),
      });

      jest
        .spyOn(repository, 'update')
        .mockImplementationOnce(() =>
          Promise.reject(new Error('product does not exist')),
        );

      await expect(service.updateProduct(reqBody)).rejects.toThrowError(
        'product does not exist',
      );
    });
  });

  describe('getProducts', () => {
    test('should get products by offset and limit', async () => {
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const products = ProductFactory.buildList(randomLimit);

      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() => Promise.resolve(products));

      const result = await service.getProducts(randomLimit, 0);

      expect(result.length).toEqual(randomLimit);
      expect(result).toMatchObject(products);
    });

    test('should throw error with products does not exist', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() =>
          Promise.reject(new Error('products does not exist')),
        );

      await expect(service.getProducts(0, 0)).rejects.toThrowError(
        'products does not exist',
      );
    });
  });

  describe('getProduct', () => {
    test('should get product by id', async () => {
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const product = ProductFactory.build();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(product));

      const result = await service.getProduct(product.id!);

      expect(result).toMatchObject(product);
    });
  });

  describe('deleteProduct', () => {
    test('should delete product by id', async () => {
      const product = ProductFactory.build();

      jest
        .spyOn(repository, 'delete')
        .mockImplementationOnce(() => Promise.resolve({ id: product.id }));

      const result = await service.deleteProduct(product.id!);

      expect(result).toMatchObject({ id: product.id });
    });
  });
});
