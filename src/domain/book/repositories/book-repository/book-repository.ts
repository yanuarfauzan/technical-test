import { Injectable } from "@nestjs/common";
import { BookStatus } from "@prisma/client";
import { BookDto } from "src/application/book/book-dto/book-dto";
import { PrismaService } from "../../../../infrastructure/database/services/prisma/prisma.service";

@Injectable()
export class BookRepository {
    constructor(private prismaService: PrismaService) { }

    async getAllBook(): Promise<any> {
        return await this.prismaService.book.findMany({
            select: {
                id: true,
                code: true,
                title: true,
                author: true,
                stock: true,
                status: true
            },
            where: {
                status: 'AVAILABLE'
            }
        });
    }

    async findById(bookId: string): Promise<any> {
        return await this.prismaService.book.findUnique({
            where: {
                id: bookId
            }
        })
    }

    async updateStatus(bookId: string, status: BookStatus, borrowedDate?: Date, dueDate?: Date, doWhat?: string): Promise<any> {
        const book = await this.prismaService.book.findUnique({
            where: {
                id: bookId
            }
        })

        if (!book) {
            throw new Error('Book not found');
        }

        return await this.prismaService.book.update({
            where: {
                id: bookId
            },
            data: {
                status: status,
                borrowedDate: borrowedDate,
                dueDate: dueDate,
                stock: doWhat === 'borrow' ? book.stock - 1 : book.stock + 1
            }
        })
    }

    async getBorrowedBooks(memberId: string): Promise<any> {
        const book = await this.prismaService.book.findMany({
            where: {
                memberId: memberId
            },
            orderBy: {
                borrowedDate: 'asc'
            },
        })
        return book;
    }
}
