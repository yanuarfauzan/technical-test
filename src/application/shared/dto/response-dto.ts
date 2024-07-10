import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto<T> {
    @ApiProperty({ example: 200, description: 'HTTP status code' })
    statusCode: number;

    @ApiProperty({ example: 'Success', description: 'Message describing the result' })
    message: string;

    @ApiProperty({ type: () => [Object], description: 'Data payload' })
    data: T;
}
