import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { PrismaService } from 'src/common/services/prisma.service';
import { PrismaSelect } from 'src/common/types';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(select: PrismaSelect) {
    return this.prisma.company.findMany({
      where: {
        isActive: true,
      },
      select,
    });
  }

  async findOne(id: string, select: PrismaSelect) {
    const user = await this.prisma.company.findUnique({
      where: { id },
      select
    });
    if (!user) {
      throw new NotFoundException('La empresa que intenta consultar no existe');
    }
    return user;
  }

  async create(createCompanyInput: CreateCompanyInput) {
    try {
      const existsCompany = await this.prisma.company.findFirst({
        where: {
          name: createCompanyInput.name,
        },
      });

      if (existsCompany) {
        throw new BadRequestException('Ya existe una empresa con ese nombre');
      }

      const newCompany = await this.prisma.company.create({
        data: createCompanyInput,
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateCompanyInput: UpdateCompanyInput) {
    try {
      // console.log({updateCompanyInput, id})
      const company = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new BadRequestException(
          'La empresa que intenta actualizar no existe',
        );
      }

      const updatedCompany = await this.prisma.company.update({
        where: { id },
        data: updateCompanyInput,
      });

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const existCompany = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!existCompany) {
        throw new NotFoundException(
          'La empresa que intenta eliminar no existe',
        );
      }

      const deletedCompany = await this.prisma.company.update({
        where: { id },
        data: {
          isActive: false,
        },
      });

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
