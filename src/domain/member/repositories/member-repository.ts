import { Injectable } from "@nestjs/common";
import { Member } from "@prisma/client";
import { PrismaService } from "src/infrastructure/database/services/prisma/prisma.service";

@Injectable()
export class MemberRepository {
    constructor(private prismaService: PrismaService) {}

    async getAllMember(): Promise<Member[]> {
        return await this.prismaService.member.findMany();
    }
}
