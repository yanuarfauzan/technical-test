import { Test, TestingModule } from '@nestjs/testing';
import { BookRepository } from '../repositories/book-repository/book-repository';
import { BookService } from './book.service';

describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: BookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: BookRepository,
          useValue: {
            getAllBook: jest.fn(),
          },
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookRepository = module.get<BookRepository>(BookRepository);
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  it('should return all books', async () => {
    const mockBooks = [
      {
        id: '1',
        code: 'B001',
        title: 'Test Book 1',
        author: 'Author 1',
        stock: 10,
        status: 'AVAILABLE',
      },
      {
        id: '2',
        code: 'B002',
        title: 'Test Book 2',
        author: 'Author 2',
        stock: 5,
        status: 'AVAILABLE',
      },
    ];

    jest.spyOn(bookRepository, 'getAllBook').mockResolvedValue(mockBooks);

    const result = await bookService.getAllBook();

    expect(result).toEqual(mockBooks);
    expect(bookRepository.getAllBook).toHaveBeenCalled();
  });
});
