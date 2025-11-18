import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  exports: [PrismaService],
  providers: [PrismaService],
  imports: [ConfigModule],
})
export class CommonModule {}
