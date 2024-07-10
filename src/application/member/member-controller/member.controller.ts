import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberService } from 'src/domain/member/services/member/member.service';
import { MemberDto } from '../member-dto/member-dto';
import { ResponseDto } from 'src/application/shared/dto/response-dto';

@ApiTags('Members')
@Controller('/api/member')
export class MemberController {
    constructor(private memberService: MemberService) { }

    @Get('/get-all-member')
    @ApiOperation({ summary: 'Get all members' })
    @ApiResponse({ status: 200, type: [MemberDto], description: 'get all member success',
        example: {
            statusCode: 200,
            message: 'Get all member success',
            data: [
                {
                    id: 'af0472cf-3e04-11ef-a793-00090ffe0001',
                    code: 'M001',
                    name: 'John Doe',
                    status: 'ACTIVE',
                    penalizedDate: null,
                    Book: null
                },
            ],
    }})
    async getAllMember(): Promise<ResponseDto<MemberDto[]>> {
        const members = await this.memberService.getAllMember();
        return {
            statusCode: HttpStatus.OK,
            message: 'get all member success',
            data: members
        }
    }
}
