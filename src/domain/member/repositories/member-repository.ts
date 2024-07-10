import { Injectable } from "@nestjs/common";
import { MemberDto } from "src/application/member/member-dto/member-dto";
import { PrismaService } from "src/infrastructure/database/services/prisma/prisma.service";

@Injectable()
export class MemberRepository {
    constructor(private prismaService: PrismaService) { }

    async getAllMember(): Promise<MemberDto[]> {
        const members = await this.prismaService.member.findMany({
            include: {
                Book: true
            }
        });

        return members.map((member) => ({
            id: member.id,
            code: member.code,
            name: member.name,
            status: member.status,
            borrowedBooksCount: member.Book.length,            
        }));
    }

}
