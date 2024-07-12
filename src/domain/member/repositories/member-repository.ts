import { Injectable } from "@nestjs/common";
import { BookStatus, MemberStatus } from "@prisma/client";
import { MemberDto } from "../../../application/member/member-dto/member-dto";
import { PrismaService } from "../../../infrastructure/database/services/prisma/prisma.service";

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
            penalizedDate: member.penalizedDate,
            penaltyEndDate: member.penaltyEndDate,
            borrowedBooksCount: member.Book.length,
        }));
    }

    async borrowBook(memberId: string, bookId: string): Promise<any> {
        const updatedMember = await this.prismaService.member.update({
            where: {
                id: memberId
            },
            data: {
                Book: {
                    connect: {
                        id: bookId,
                    },
                },
            },
            include: {
                Book: true
            }
        });
        return updatedMember;
    }

    async findById(memberId: string): Promise<any> {
        return await this.prismaService.member.findUnique({
            where: {
                id: memberId
            },
            include: {
                Book: true
            }
        })
    }

    async updateStatus(memberId: string, status: MemberStatus, penalizedDate?: string, penaltyEndDate?: string): Promise<MemberDto> {
        const updatedStatusMember = await this.prismaService.member.update({
            where: {
                id: memberId
            },
            data: {
                status: status,
                penalizedDate: penalizedDate,
                penaltyEndDate: penaltyEndDate
            },
        })
        return updatedStatusMember;
    }

    async returnBook(memberId: string, bookId: string): Promise<any> {
        const updatedMember = await this.prismaService.member.update({
            where: {
                id: memberId
            },
            data: {
                Book: {
                    disconnect: {
                        id: bookId,
                    },
                },
            },
        })

        return updatedMember;
    }

    async getPenalizedDateAndPenaltyEndDate(memberId: string): Promise<any> {
        return await this.prismaService.member.findUnique({
            where: {
                id: memberId
            },
            select: {
                penalizedDate: true,
                penaltyEndDate: true
            }
        })
    }

}
