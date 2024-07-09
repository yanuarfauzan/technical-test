import { Controller, Get } from '@nestjs/common';
import { Member } from '@prisma/client';
import { MemberService } from 'src/domain/member/services/member/member.service';

@Controller('/api/member')
export class MemberController {
    constructor(private memberService: MemberService) {}

    @Get('/get-members')
    async getAllMember(): Promise<Member[]> {
        return await this.memberService.getAllMember();
    }
}
