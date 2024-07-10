import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../repositories/book-repository/book-repository';
import { BookDto } from 'src/application/book/book-dto/book-dto';

@Injectable()
export class BookService {
    constructor(private bookRepository: BookRepository) {}

    async getAllBook(): Promise<BookDto[]> {
        return await this.bookRepository.getAllBook();
    }
}
