import { ApiProperty } from "@nestjs/swagger";
import { BookDto } from "src/application/book/book-dto/book-dto";

export class MemberDto {
    @ApiProperty({ example: "af042626-3e04-11ef-a793-00090ffe0001", description: "The id of the member" })
    id: string;
    @ApiProperty({ example: "M001", description: "The code of the member" })
    code: string;
    @ApiProperty({ example: "Yanuar", description: "The name of the member" })
    name: string;
    @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'PENALTY'], description: 'The status of the member' })
    status?: string;
    @ApiProperty({ example: '2024-07-15 2024-07-16', description: 'The penalized date of the member' })
    penalizedDate?: string;
    @ApiProperty({ example: '2024-07-15 2024-07-16', description: 'The penalty end date of the member' })
    penaltyEndDate?: string;
    @ApiProperty({ example: 0, description: 'The borrowed books of the member' })
    borrowedBooksCount?: number;
}
