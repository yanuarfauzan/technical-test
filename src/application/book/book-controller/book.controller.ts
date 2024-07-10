import { Controller, Get, HttpStatus } from '@nestjs/common';
import { BookService } from 'src/domain/book/services/book/book.service';
import { BookDto } from '../book-dto/book-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/application/shared/dto/response-dto';
import { MemberDto } from 'src/application/member/member-dto/member-dto';

@ApiTags('Books')
@Controller('api/books')
export class BookController {
    constructor(private bookService: BookService) { }

    @Get('get-all-book')
    @ApiOperation({ summary: 'Get All Books' })
    @ApiResponse({status: 200, type: [BookDto], description: 'Get all book success',
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
                        borrowedDate: null,
                        memberId: 'af042626-3e04-11ef-a793-00090ffe0001',
                        member: {
                            id: 'af042626-3e04-11ef-a793-00090ffe0001',
                            code: 'M001',
                            name: 'John Doe',
                            status: 'ACTIVE',
                            penalizedDate: null
                        },
                    },
                ],
        },
    })
    async getAllBook(): Promise<ResponseDto<BookDto[]>> {
        const books = await this.bookService.getAllBook();
        return {
            statusCode: HttpStatus.OK,
            message: 'get all book success',
            data: books
        }
    }
}
