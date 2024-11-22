import { CartRepository } from '../../repository/cart.repository';
import { CartRepositoryType } from '../../types/repository.type';
import { CreateCart } from '../cart.service';

describe('cart service', () => {
  let repository: CartRepositoryType;

  beforeEach(() => {
    repository = CartRepository;
  });

  afterEach(() => {
    repository = {} as CartRepositoryType;
  });

  it('should return correct data while creating cart', async () => {
    const mockCart = {
      title: 'smart phone',
      price: 1000,
    };

    // mock so that when CreateCart() is called, it should return the below response
    jest.spyOn(repository, 'create').mockImplementation(() =>
      Promise.resolve({
        message: 'fake response from cart repository',
        input: mockCart,
      }),
    );

    const res = await CreateCart(mockCart, repository);

    expect(res).toEqual({
      message: 'fake response from cart repository',
      input: mockCart,
    });
  });
});
