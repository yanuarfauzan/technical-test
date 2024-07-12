import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from '../../../domain/member/services/member.service';
import { MemberDto } from '../member-dto/member-dto';
import { ResponseDto } from '../../../application/shared/dto/response-dto';
import { RequestBookDto } from '../request-book-dto/request-book-dto';
import { HttpStatus } from '@nestjs/common';
import { BookStatus } from '@prisma/client';

describe('MemberController', () => {
  let controller: MemberController;
  let mockMemberService = {
    getAllMember: jest.fn().mockReturnValue([
      {
        id: 'af042626-3e04-11ef-a793-00090ffe0001',
        code: 'M001',
        name: 'Angga',
        status: 'ACTIVE',
        penalizedDate: null,
        penaltyEndDate: null,
        borrowedBooksCount: 0
      },
    ]),
    borrowBook: jest.fn().mockReturnValue({
      statusCode: HttpStatus.OK,
      message: 'Borrow book successfull',
      data: {
        memberId: 'af042626-3e04-11ef-a793-00090ffe0001',
        book: {
          id: 'e0afcfd7-3e17-11ef-a793-00090ffe0001',
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K. Rowling',
          stock: 1,
          status: 'AVAILABLE',
          borrowedDate: null,
          dueDate: null,
          memberId: null
        },
      }
    }),
    returnBook: jest.fn().mockReturnValue({
      statusCode: HttpStatus.OK,
      message: 'Return book successfull',
      data: {
        memberId: 'af042626-3e04-11ef-a793-00090ffe0001',
        book: {
          id: 'e0afcfd7-3e17-11ef-a793-00090ffe0001',
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K. Rowling',
          stock: 1,
          status: 'AVAILABLE',
          borrowedDate: null,
          dueDate: null,
          memberId: null
        },
        penalty: {
          isPenalized: false,
          penalizedDate: null,
          penaltyEndDate: null,
          reason: "Overdue return",
        }
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [MemberService],
    }).overrideProvider(MemberService).useValue(mockMemberService).compile();

    controller = module.get<MemberController>(MemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })

  it('should be return lists of members', async () => {
    const result: ResponseDto<MemberDto[]> = await controller.getAllMember();

    expect(result).toEqual({
      statusCode: 200,
      message: "get all member success",
      data: [
        {
          id: "af042626-3e04-11ef-a793-00090ffe0001",
          code: "M001",
          name: "Angga",
          status: "ACTIVE",
          penalizedDate: null,
          penaltyEndDate: null,
          borrowedBooksCount: 0
        }]
    });

    expect(mockMemberService.getAllMember).toHaveBeenCalled();
  });

  it('should borrow book', async () => {
    const requestBookDto: RequestBookDto = {
      memberId: 'af042626-3e04-11ef-a793-00090ffe0001',
      bookId: 'e0afcfd7-3e17-11ef-a793-00090ffe0001'
    }
    const result: ResponseDto<any> = await controller.borrowBook(requestBookDto);
    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Borrow book successfull',
      data: {
        memberId: "af042626-3e04-11ef-a793-00090ffe0001",
        book: {
          id: 'e0afcfd7-3e17-11ef-a793-00090ffe0001',
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K. Rowling',
          stock: 1,
          status: BookStatus.AVAILABLE,
          borrowedDate: null,
          dueDate: null,
          memberId: null
        },
      }
    })

    expect(mockMemberService.borrowBook).toHaveBeenCalled();
  })

  it('should return book', async () => {
    const requestBookDto: RequestBookDto = {
      memberId: 'af042626-3e04-11ef-a793-00090ffe0001',
      bookId: 'e0afcfd7-3e17-11ef-a793-00090ffe0001'
    }
    const result = await controller.returnBook(requestBookDto);
    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Return book successfull',
      data: {
        memberId: "af042626-3e04-11ef-a793-00090ffe0001",
        book: {
          id: 'e0afcfd7-3e17-11ef-a793-00090ffe0001',
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K. Rowling',
          stock: 1,
          status: 'AVAILABLE',
          borrowedDate: null,
          dueDate: null,
          memberId: null
        },
        penalty: {
          isPenalized: false,
          penalizedDate: null,
          penaltyEndDate: null,
          reason: "Overdue return",
        }
      }
    })

    expect(mockMemberService.returnBook).toHaveBeenCalled();
  })
});
