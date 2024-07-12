import { Injectable } from '@nestjs/common';
import { BookRepository } from '../repositories/book-repository/book-repository';

@Injectable()
export class BookService {
    constructor(private bookRepository: BookRepository) {}

    async getAllBook(): Promise<any> {
        return await this.bookRepository.getAllBook();
    }
}
