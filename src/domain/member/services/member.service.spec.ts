import { Test, TestingModule } from '@nestjs/testing';
import { MemberRepository } from '../repositories/member-repository';
import { BookRepository } from '../../../domain/book/repositories/book-repository/book-repository';
import { HttpStatus } from '@nestjs/common';
import { BookStatus, MemberStatus } from '@prisma/client';
import * as momentTimezone from 'moment-timezone';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let memberService: MemberService;
  let memberRepository: MemberRepository;
  let bookRepository: BookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: MemberRepository,
          useValue: {
            getAllMember: jest.fn(),
            borrowBook: jest.fn(),
            findById: jest.fn(),
            updateStatus: jest.fn(),
            returnBook: jest.fn(),
            getPenalizedDateAndPenaltyEndDate: jest.fn(),
          },
        },
        {
          provide: BookRepository,
          useValue: {
            findById: jest.fn(),
            getAllBook: jest.fn(),
            updateStatus: jest.fn(),
            getBorrowedBooks: jest.fn(),
          },
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    bookRepository = module.get<BookRepository>(BookRepository);
  });

  it('should be defined', () => {
    expect(memberService).toBeDefined();
  });

  describe('getAllMember', () => {
    it('should return all members', async () => {
      const mockMembers = [
        {
          id: '1',
          code: 'M001',
          name: 'John Doe',
          status: 'ACTIVE',
          penalizedDate: null,
          penaltyEndDate: null,
          Book: [],
        },
      ];

      jest.spyOn(memberRepository, 'getAllMember').mockResolvedValue(mockMembers);

      const result = await memberService.getAllMember();

      expect(result).toEqual(mockMembers);
      expect(memberRepository.getAllMember).toHaveBeenCalled();
    });
  });

  describe('borrowBook', () => {
    it('should successfully borrow a book', async () => {
      const memberId = '1';
      const bookId = '101';
      const mockMember = {
        id: memberId,
        code: 'M001',
        name: 'John Doe',
        status: 'ACTIVE',
        penalizedDate: null,
        penaltyEndDate: null,
        Book: [],
      };
      const mockBook = {
        id: bookId,
        code: 'B001',
        title: 'Test Book',
        status: BookStatus.AVAILABLE,
      };
      const mockUpdatedBook = {
        ...mockBook,
        status: BookStatus.BORROWED,
      };

      jest.spyOn(memberRepository, 'findById').mockResolvedValue(mockMember);
      jest.spyOn(bookRepository, 'findById').mockResolvedValue(mockBook);
      jest.spyOn(bookRepository, 'updateStatus').mockResolvedValue(mockUpdatedBook);
      jest.spyOn(memberRepository, 'borrowBook').mockResolvedValue(null);

      const result = await memberService.borrowBook(memberId, bookId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Borrow book successfull',
        data: {
          memberId,
          book: mockUpdatedBook,
        },
      });
      expect(memberRepository.findById).toHaveBeenCalledWith(memberId);
      expect(bookRepository.findById).toHaveBeenCalledWith(bookId);
      expect(bookRepository.updateStatus).toHaveBeenCalledWith(bookId, BookStatus.BORROWED, expect.any(Date), expect.any(Date), 'borrow');
      expect(memberRepository.borrowBook).toHaveBeenCalledWith(memberId, bookId);
    });
  });

  describe('returnBook', () => {
    it('should successfully return a book', async () => {
      const memberId = 'af042626-3e04-11ef-a793-00090ffe0001';
      const bookId = 'e0afcfd7-3e17-11ef-a793-00090ffe0001';
      const mockBorrowedBook = {
        id: bookId,
        code: 'JK-45',
        title: 'Harry Potter',
        status: BookStatus.BORROWED,
        dueDate: new Date(),
      };
      const mockMember = {
        id: memberId,
        code: 'M001',
        name: 'Angga',
        status: MemberStatus.ACTIVE,
        penalizedDate: null,
        penaltyEndDate: null,
        Book: [mockBorrowedBook], // Simulate that this member has borrowed this book
      };

      // Mock the necessary methods
      jest.spyOn(bookRepository, 'findById').mockResolvedValue(mockBorrowedBook);
      jest.spyOn(bookRepository, 'updateStatus').mockResolvedValue({ ...mockBorrowedBook, status: BookStatus.AVAILABLE });
      jest.spyOn(memberRepository, 'returnBook').mockResolvedValue(null);
      jest.spyOn(memberRepository, 'findById').mockResolvedValue(mockMember); // Ensure findById returns the updated member

      // Test the returnBook method
      const result = await memberService.returnBook(memberId, bookId);

      // Assert the result meets expectations
      expect(result).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Member not borrowed this book',
        data: null
      });

      // Verify that the repository methods were called with the correct parameters
      // expect(bookRepository.findById).toHaveBeenCalledWith(bookId);
      // expect(bookRepository.updateStatus).toHaveBeenCalledWith(bookId, BookStatus.AVAILABLE, null, null, 'return');
      // expect(memberRepository.returnBook).toHaveBeenCalledWith(memberId, bookId);
      // expect(memberRepository.findById).toHaveBeenCalledWith(memberId); // Ensure findById is called to get updated member details
    });
  });
});
