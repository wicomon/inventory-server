import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CommonService } from './services/common.service';

@Global()
@Module({
  exports: [PrismaService, CommonService],
  providers: [PrismaService, CommonService],
  imports: [ConfigModule],
})
export class CommonModule {}
