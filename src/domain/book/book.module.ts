import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/database/prisma.module';
import { BookRepository } from './repositories/book-repository/book-repository';
import { BookService } from './services/book/book.service';
import { BookController } from 'src/application/book/book-controller/book.controller';

@Module({
    imports: [PrismaModule],
    controllers: [BookController],
    providers: [
        BookRepository,
        BookService
    ],
})
export class BookModule {}
