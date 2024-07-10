import { ApiProperty } from "@nestjs/swagger";

export class MemberDto {
    @ApiProperty({ example: "M001", description: "The code of the member" })
    code: string;
    @ApiProperty({ example: "Yanuar", description: "The name of the member" })
    name: string;
    @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'PENALTY'], description: 'The status of the member' })
    status?: string;
    @ApiProperty({ example: '2024-07-15 2024-07-16', description: 'The penalized date of the member' })
    penalizedDate?: string;
}
