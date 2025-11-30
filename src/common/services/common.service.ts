import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);
  handleErrors(error: any) {
    // use logger instead of consolelog
    // console.log(error);
    this.logger.error(error);
    if (error instanceof HttpException) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      switch (error.code) {
        case 'P2000':
          throw new BadRequestException('Provided value is too long');
        case 'P2002':
          throw new BadRequestException('Unique constraint failed');
        case 'P2003':
          throw new BadRequestException('Foreign key constraint failed');
        case 'P2005':
          throw new BadRequestException('Invalid Field Type');
        case 'P2025':
          throw new NotFoundException('Record not found');
        default:
          throw new InternalServerErrorException('Database error');
      }
    } else if (error.status) {
      // Handle other known errors
      throw new NotFoundException(error.response);
    } else {
      // Handle unknown errors
      throw new InternalServerErrorException('Internal Error');
    }
  }
}
