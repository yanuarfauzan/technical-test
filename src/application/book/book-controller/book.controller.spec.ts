import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from '../../../domain/book/services/book.service';

describe('BookController', () => {
  let controller: BookController;
  let mockBookService = {
    getAllBook: jest.fn().mockResolvedValue([
      {
        id: 'e0afcfd7-3e17-11ef-a793-00090ffe0001',
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1,
        status: 'AVAILABLE'
      },
    ]
    ),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService]
    }).overrideProvider(BookService).useValue(mockBookService).compile();
    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all book', async () => {
    const result = await controller.getAllBook();

    expect(result).toEqual({
      statusCode: 200,
      message: "get all book success",
      data: [
        {
          id: "e0afcfd7-3e17-11ef-a793-00090ffe0001",
          code: "JK-45",
          title: "Harry Potter",
          author: "J.K Rowling",
          stock: 1,
          status: "AVAILABLE"
        },
      ]
    })
    expect(mockBookService.getAllBook).toHaveBeenCalled();
  }
)


});
