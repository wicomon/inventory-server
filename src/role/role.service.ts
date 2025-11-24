import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { PrismaService } from 'src/common/services/prisma.service';
import { PrismaSelect } from 'src/common/types';
import { CommonService } from 'src/common/services/common.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commonService: CommonService,
  ) {}

  async findAll(select: PrismaSelect) {
    try {
      const roles = await this.prisma.role.findMany({
        where: {
          isActive: true,
        },
        select,
      });
      return roles;
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }

  async findOne(id: string, select: PrismaSelect) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
        select,
      });
      if (!role) {
        throw new NotFoundException('El rol que intenta consultar no existe');
      }
      return role;
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }

  async create(createRoleInput: CreateRoleInput) {
    try {
      const existsRole = await this.prisma.role.findFirst({
        where: {
          name: createRoleInput.name,
        },
      });

      if (existsRole) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }

      const newRole = await this.prisma.role.create({
        data: createRoleInput,
      });

      return true;
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }

  async update(id: string, updateRoleInput: UpdateRoleInput) {
    try {
      const existsRole = await this.prisma.role.findUnique({
        where: { id },
      });

      if (!existsRole) {
        throw new NotFoundException('El rol que intenta actualizar no existe');
      }

      const updatedRole = await this.prisma.role.update({
        where: { id },
        data: updateRoleInput,
      });

      return true;
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const existsRole = await this.prisma.role.findUnique({
        where: { id },
      });

      if (!existsRole) {
        throw new NotFoundException('El rol que intenta eliminar no existe');
      }

      const deletedRole = await this.prisma.role.update({
        where: { id },
        data: { isActive: false },
      });

      return true;
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }
}
