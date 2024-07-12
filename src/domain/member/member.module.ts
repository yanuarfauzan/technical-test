import { Module } from '@nestjs/common';
import { MemberController } from '../../application/member/member-controller/member.controller';
import { MemberRepository } from './repositories/member-repository';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { MemberService } from './services/member.service';
import { BookRepository } from '../book/repositories/book-repository/book-repository';

@Module({
  imports: [PrismaModule],
  controllers: [MemberController],
  providers: [
    MemberRepository,
    MemberService,
    BookRepository
  ]
})
export class MemberModule { }
