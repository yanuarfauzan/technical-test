import { Module } from '@nestjs/common';
import { MemberModule } from './domain/member/member.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { BookModule } from './domain/book/book.module';
import { BookController } from './application/book/book-controller/book.controller';
import { BookService } from './domain/book/services/book/book.service';
import { MemberService } from './domain/member/services/member/member.service';
import { MemberRepository } from './domain/member/repositories/member-repository';
import { BookRepository } from './domain/book/repositories/book-repository/book-repository';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MemberModule,
    PrismaModule,
    BookModule],
  controllers: [BookController],
  providers: [
    BookService, 
    MemberService,
    MemberRepository,
    BookRepository
  ],
})
export class AppModule {}
