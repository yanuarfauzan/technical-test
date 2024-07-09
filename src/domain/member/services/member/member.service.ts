import { Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { MemberRepository } from '../../repositories/member-repository';

@Injectable()
export class MemberService {
    constructor(private memberRepository: MemberRepository) {}

    getAllMember(): Promise<Member[]> {
        return this.memberRepository.getAllMember();
    }
}
