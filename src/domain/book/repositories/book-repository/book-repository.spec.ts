import { BookStatus, PrismaClient } from '@prisma/client';
import { BookRepository } from './book-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../infrastructure/database/services/prisma/prisma.service';

describe('BookRepository', () => {
  let bookRepository: BookRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRepository,
        {
          provide: PrismaService,
          useValue: {
            book: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    bookRepository = module.get<BookRepository>(BookRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(bookRepository).toBeDefined();
  });

  it('should return all available books', async () => {
    const mockBooks = [
      { id: '1', code: 'B001', title: 'Test Book 1', author: 'Author 1', stock: 10, status: 'AVAILABLE' },
      { id: '2', code: 'B002', title: 'Test Book 2', author: 'Author 2', stock: 5, status: 'AVAILABLE' },
    ];
    prismaService.book.findMany = jest.fn().mockResolvedValue(mockBooks);

    const result = await bookRepository.getAllBook();

    expect(result).toEqual(mockBooks);
    expect(prismaService.book.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        code: true,
        title: true,
        author: true,
        stock: true,
        status: true,
      },
      where: {
        status: 'AVAILABLE',
      },
    });
  });

  it('should find a book by id', async () => {
    const mockBook = { id: '1', code: 'B001', title: 'Test Book 1', author: 'Author 1', stock: 10, status: 'AVAILABLE' };
    prismaService.book.findUnique = jest.fn().mockResolvedValue(mockBook);

    const result = await bookRepository.findById('1');

    expect(result).toEqual(mockBook);
    expect(prismaService.book.findUnique).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
  });

  it('should update book status', async () => {
    const mockBook = { id: '1', code: 'B001', title: 'Test Book 1', author: 'Author 1', stock: 10, status: 'AVAILABLE' };
    const updatedBook = { ...mockBook, status: 'BORROWED', stock: 9 };

    prismaService.book.findUnique = jest.fn().mockResolvedValue(mockBook);
    prismaService.book.update = jest.fn().mockResolvedValue(updatedBook);

    const result = await bookRepository.updateStatus('1', BookStatus.BORROWED, new Date(), new Date(), 'borrow');

    expect(result).toEqual(updatedBook);
    expect(prismaService.book.findUnique).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
    expect(prismaService.book.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        status: BookStatus.BORROWED,
        borrowedDate: expect.any(Date),
        dueDate: expect.any(Date),
        stock: 9,
      },
    });

  });
  it('should return borrowed books for a member', async () => {
    const mockBooks = [
      { id: '1', code: 'B001', title: 'Test Book 1', author: 'Author 1', stock: 10, status: 'BORROWED', memberId: 'm1', borrowedDate: new Date() },
      { id: '2', code: 'B002', title: 'Test Book 2', author: 'Author 2', stock: 5, status: 'BORROWED', memberId: 'm1', borrowedDate: new Date() },
    ];
    prismaService.book.findMany = jest.fn().mockResolvedValue(mockBooks);

    const result = await bookRepository.getBorrowedBooks('m1');

    expect(result).toEqual(mockBooks);
    expect(prismaService.book.findMany).toHaveBeenCalledWith({
      where: {
        memberId: 'm1',
      },
      orderBy: {
        borrowedDate: 'asc',
      },
    });
  });

});
