import { ApiProperty } from "@nestjs/swagger";
import { MemberDto } from "src/application/member/member-dto/member-dto";

export class BookDto {
    @ApiProperty({ example: "JK-45", description: "The code of the book" })
    code: string;
    @ApiProperty({ example: "Harry Potter", description: "The title of the book" })
    title: string;
    @ApiProperty({ example: "J.K Rowling", description: "The author of the book" })
    author: string;
    @ApiProperty({ example: 50, description: "The stock of the book" })
    stock: number;
    @ApiProperty({ example: "AVAILABLE", description: "The status of the book" })
    status: string;
    @ApiProperty({ example: "2022-01-01T00:00:00.000Z", description: "The borrowed date of the book" })
    borrowedDate: Date;
    @ApiProperty({ example: "af042626-3e04-11ef-a793-00090ffe0001", description: "The member id who borrowed the book" })
    memberId: string;
    @ApiProperty()
    member: MemberDto

}
