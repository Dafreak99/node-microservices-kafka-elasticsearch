import { Prisma, User } from '@prisma/client';
import { CreateUserRequest } from '../dto/CreateUserRequest.dto';

export interface IUserRepository {
  create(data: CreateUserRequest): Promise<User>;
  update(data: User): Promise<User>;
  delete(id: number): unknown;
  find(
    where: Prisma.UserWhereInput,
    limit: number,
    offset: number,
  ): Promise<User[]>;
  findOne(where: Prisma.UserWhereInput): Promise<User | null>;
}
