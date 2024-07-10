import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../repositories/member-repository';
import { MemberDto } from 'src/application/member/member-dto/member-dto';

@Injectable()
export class MemberService {
    constructor(private memberRepository: MemberRepository) {}

    getAllMember(): Promise<MemberDto[]> {
        return this.memberRepository.getAllMember();
    }
}
