import { ApiProperty } from "@nestjs/swagger";

export class RequestBookDto {
    @ApiProperty()
    memberId: string;
    @ApiProperty()
    bookId: string;
}
