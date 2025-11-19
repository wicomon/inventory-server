import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    const users = this.prismaService.user.findMany({});
    return users;
  }

  findOne(id: string) {
    const user = this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
