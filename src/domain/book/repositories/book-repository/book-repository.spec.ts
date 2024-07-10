import { BookRepository } from './book-repository';

describe('BookRepository', () => {
  it('should be defined', () => {
    expect(new BookRepository()).toBeDefined();
  });
});
