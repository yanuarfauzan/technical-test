import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../../../application/shared/dto/response-dto';
import { MemberService } from '../../../domain/member/services/member.service';
import { MemberDto } from '../member-dto/member-dto';
import { RequestBookDto } from '../request-book-dto/request-book-dto';

@ApiTags('Member check, borrow and return book')
@Controller('/api/member')
export class MemberController {
    constructor(private memberService: MemberService) { }

    @Get('/get-all-member')
    @ApiOperation({ summary: '(Shows all existing members, The number of books being borrowed by each member)' })
    @ApiResponse({
        status: 200, type: [MemberDto], description: 'get all member success',
        example: {
            statusCode: 200,
            message: 'Get all member success',
            data: [
                {
                    id: 'af0472cf-3e04-11ef-a793-00090ffe0001',
                    code: 'M001',
                    name: 'John Doe',
                    status: 'ACTIVE',
                    penalizedDate: null,
                    penaltyEndDate: null,
                    borrowedBooksCount: 1,
                },
            ],
        }
    })
    async getAllMember(): Promise<ResponseDto<MemberDto[]>> {
        const members = await this.memberService.getAllMember();
        return {
            statusCode: HttpStatus.OK,
            message: 'get all member success',
            data: members
        }
    }

    @Post('/borrow-book')
    @ApiBody({ type: RequestBookDto })
    @ApiOperation({ summary: '(Members may not borrow more than 2 books, Borrowed books are not borrowed by other members, Member is currently not being penalized)' })
    @ApiResponse({
        status: 200, type: [MemberDto], description: 'borrow book success',
        example: {
            statusCode: HttpStatus.OK,
            message: 'Borrow book successfull',
            data: {
                memberId: "af0472xsd-3e04-11ef-a793-00090ffe0001",
                book: {
                    id: 'af0472cf-3e04-11ef-a793-00090ffe0001',
                    code: 'M001',
                    title: 'Harry Potter',
                    stock: 0,
                    status: 'BORROWED',
                    borrowedDate: '2024-07-11 10:07:56',
                },
            }
        }
    })
    async borrowBook(@Body() requestBody: RequestBookDto): Promise<ResponseDto<any>> {
        const { memberId, bookId } = requestBody;
        const result = await this.memberService.borrowBook(memberId, bookId);
        return {
            statusCode: result.statusCode,
            message: result.message,
            data: result.data
        }
    }

    @Post('/return-book')
    @ApiBody({ type: RequestBookDto })
    @ApiOperation({ summary: '(The returned book is a book that the member has borrowed, If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days)' })
    @ApiResponse({
        status: 200, type: [MemberDto], description: 'return book success',
        example: {
            statusCode: 200,
            message: 'Return book successfull',
            data: {
                memberId: "af0472xsd-3e04-11ef-a793-00090ffe0001",
                book: {
                    id: 'af0472cf-3e04-11ef-a793-00090ffe0001',
                    code: 'M001',
                    title: 'Harry Potter',
                    stock: 0,
                    status: 'AVAILABLE',
                    borrowedDate: '2024-07-11 10:07:56',
                },
                penalty: {
                    isPenalized: true,
                    penalizedDate: "2024-07-11",
                    penaltyEndDate: "2024-07-18",
                    reason: "Overdue return",
                }
            }
        }
    })
    async returnBook(@Body() requestBody: RequestBookDto): Promise<ResponseDto<any>> {
        const { memberId, bookId } = requestBody;
        const result = await this.memberService.returnBook(memberId, bookId);
        return {
            statusCode: result.statusCode,
            message: result.message,
            data: result.data
        }
    }
}
