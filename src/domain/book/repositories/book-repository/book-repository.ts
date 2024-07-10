import { Injectable } from "@nestjs/common";
import { BookDto } from "src/application/book/book-dto/book-dto";
import { PrismaService } from "src/infrastructure/database/services/prisma/prisma.service";

@Injectable()
export class BookRepository {
    constructor(private prismaService: PrismaService) { }

    async getAllBook(): Promise<BookDto[]> {
        return await this.prismaService.book.findMany({
            include: {
                member: true
            },
            where: {
                status: 'AVAILABLE'
            }
        });
    }
}
