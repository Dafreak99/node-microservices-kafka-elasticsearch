import { PrismaClient, User } from '@prisma/client';
import { IUserRepository } from '../interfaces/userRepository.interface';
import { Prisma } from '@prisma/client';
import { CreateUserRequest } from '../dto/CreateUserRequest.dto';

export class UserRepository implements IUserRepository {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateUserRequest): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }
  async update(data: User): Promise<User> {
    return await this.prisma.user.update({
      where: { id: data.id },
      data,
    });
  }
  async delete(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
  async find(
    where: Prisma.UserWhereInput,
    limit: number,
    offset: number,
  ): Promise<User[]> {
    return await this.prisma.user.findMany({
      where,
      take: limit,
      skip: offset,
    });
  }
  async findOne(where: Prisma.UserWhereInput): Promise<User | null> {
    return await this.prisma.user.findFirst({ where });
  }
}
