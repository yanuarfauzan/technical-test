import { Controller, Get, HttpStatus } from '@nestjs/common';
import { BookDto } from '../book-dto/book-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/application/shared/dto/response-dto';
import { BookService } from '../../../domain/book/services/book.service';

@ApiTags('Check the book')
@Controller('/api/book')
export class BookController {
    constructor(private bookService: BookService) { }

    @Get('get-all-book')
    @ApiOperation({ 
        summary: '(Shows all existing books and quantities, Books that are being borrowed are not counted)' 
    })
    @ApiResponse({
        status: 200, type: [BookDto], description: 'Get all book success',
        example: {
            statusCode: 200,
            message: 'Get all book success',
            data: [
                {
                    code: 'BK001',
                    title: 'Book Title',
                    author: 'Author Name',
                    stock: 10,
                    status: 'AVAILABLE',
                },
            ],
        },
    })
    async getAllBook(): Promise<ResponseDto<any>> {
        const books = await this.bookService.getAllBook();
        console.info(books)
        return {
            statusCode: HttpStatus.OK,
            message: 'get all book success',
            data: books
        }
    }
}
