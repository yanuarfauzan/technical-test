import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';

@Module({
  exports: [PrismaService], 
  providers: [PrismaService]
})
export class PrismaModule {}
