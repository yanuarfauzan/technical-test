import { Module } from '@nestjs/common';
import { MemberController } from 'src/application/member/member-controller/member.controller';
import { MemberRepository } from './repositories/member-repository';
import { PrismaModule } from 'src/infrastructure/database/prisma.module';
import { MemberService } from './services/member/member.service';

@Module({
  imports: [PrismaModule],
  controllers: [MemberController],
  providers: [
    MemberRepository,
    MemberService
  ]
})
export class MemberModule { }
