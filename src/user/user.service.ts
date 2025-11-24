import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/common/services/prisma.service';
import * as encrypter from 'bcryptjs';
import { CommonService } from 'src/common/services/common.service';
import { PrismaSelect } from 'src/common/types';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commonService: CommonService
  ) {}

  async findAll(select: PrismaSelect) {
    try {
      const users = await this.prismaService.user.findMany({
        select
      });
      return users;
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }

  async findOne(id: string, select: PrismaSelect) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        // select
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          companyId: true,
          role: {
            select: {
              id: true,
              name: true,
              description: true,
              canCreate: true,
              canRead: true,
              canUpdate: true,
              canDelete: true,
            }
          }
        }
      });
      if(!user){
        throw new NotFoundException('Usuario no encontrado');
      }
      console.log(user)
      return user;
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }

  async create(createUserInput: CreateUserInput) {
    try {
      const { password, ...userData } = createUserInput;

      const existsCompany = await this.prismaService.company.findFirst({
        where: {
          id: userData.companyId,
        },
      });

      if (!existsCompany) {
        throw new BadRequestException('No existe empresa');
      }

      const existsUser = await this.prismaService.user.findFirst({
        where: {
          email: userData.email,
        },
      });

      if (existsUser) {
        throw new ConflictException(
          'Ya existe un usuario registrado con ese correo electrónico',
        );
      }

      const salt = encrypter.genSaltSync();
      const encryptedPassword = encrypter.hashSync(password.trim(), salt);

      const user = await this.prismaService.user.create({
        data: {
          ...userData,
          password: encryptedPassword,
        },
      });
      return true;
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
