import { User } from '@prisma/client';
import { IUserRepository } from '../interfaces/userRepository.interface';
import { NotFoundError } from '../utils';
import { CreateUserRequest } from '../dto/CreateUserRequest.dto';

export class UserService {
  private repository: IUserRepository;
  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async createUser(input: CreateUserRequest): Promise<User> {
    const data = await this.repository.create(input);

    if (!data.id) {
      throw new Error('unable to register user');
    }

    return data;
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.findOne({ email });

    return user;
  }
}
