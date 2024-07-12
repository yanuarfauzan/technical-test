import { HttpStatus, Injectable } from '@nestjs/common';
import { MemberDto } from '../../../application/member/member-dto/member-dto';
import { MemberRepository } from '../repositories/member-repository';
import { BookRepository } from '../../../domain/book/repositories/book-repository/book-repository';
import { BookStatus, MemberStatus } from '@prisma/client';
import { format } from 'date-fns';
import * as momentTimezone from 'moment-timezone';

@Injectable()
export class MemberService {
    constructor(
        private memberRepository: MemberRepository,
        private bookRepository: BookRepository
    ) { }

    async getAllMember(): Promise<MemberDto[]> {
        return await this.memberRepository.getAllMember();
    }

    async borrowBook(memberId: string, bookId: string): Promise<any> {
        try {
            const book = await this.bookRepository.findById(bookId);
            if (!book || book.status === 'BORROWED') {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Book is not available',
                    data: null
                }
            }
            const member = await this.memberRepository.findById(memberId);

            const today = momentTimezone().toDate();
            const penaltyEndDates = member?.penaltyEndDate?.split(' ');
            let latestDate: Date;
            if (penaltyEndDates?.length > 0) {
                const penaltyEndDateBook1 = penaltyEndDates[0];
                if (penaltyEndDates?.length > 1) {
                    const penaltyEndDateBook2 = penaltyEndDates[1];
                    latestDate = penaltyEndDateBook1 > penaltyEndDateBook2 ? penaltyEndDateBook1 : penaltyEndDateBook2;
                } else {
                    latestDate = penaltyEndDateBook1;
                }
            }
            const formattedLatestDate = momentTimezone(latestDate).toDate();
            if (member.status === 'PENALTY' && today <= formattedLatestDate) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Member cannot borrow while penalized',
                    data: {
                        memberId: memberId,
                        penalty: {
                            penalizedDate: member.penalizedDate,
                            penaltyEndDate: member.penaltyEndDate
                        }
                    }
                }
            } else {
                await this.memberRepository.updateStatus(
                    memberId,
                    MemberStatus.ACTIVE,
                    null,
                    null
                )
            }
            if (!member || member?.Book?.length >= 2) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Member cannot borrow more than 2 books',
                    data: null
                }
            }
            await this.memberRepository.borrowBook(memberId, bookId);
            const borrowedBook = await this.bookRepository.updateStatus(
                bookId,
                BookStatus.BORROWED,
                new Date(),
                this.calculateDueDate(),
                'borrow'
            );
            return {
                statusCode: HttpStatus.OK,
                message: 'Borrow book successfull',
                data: {
                    memberId: memberId,
                    book: borrowedBook,
                }
            };
        } catch (error) {
            throw new Error(`Failed to borrow book: ${error.message}`);
        }
    }

    private calculateDueDate(): Date {
        const now = new Date();
        const dueDate = new Date(now);
        dueDate.setDate(dueDate.getDate() + 7);
        return dueDate;
    }

    async returnBook(memberId: string, bookId: string): Promise<any> {
        try {
            const borrowedBooks = await this.bookRepository.getBorrowedBooks(memberId);
            if (borrowedBooks && borrowedBooks.length > 0) {
                let penalizedDate = [];
                let penaltyEndDate = [];
                let isPenalized = false;
                for (let i = 0; i < borrowedBooks.length; i++) {
                    if (borrowedBooks[i].id === bookId) {
                        const today = new Date();
                        const dueDate = new Date(borrowedBooks[i].dueDate);
                        if (today > dueDate) {
                            const result = await this.memberRepository.getPenalizedDateAndPenaltyEndDate(memberId);
                            if (result && result.penalizedDate !== null && result.penaltyEndDate !== null) {
                                penalizedDate = result.penalizedDate.split(" ");
                                penalizedDate.push(today.toISOString().split(" ")[0]);
                                penaltyEndDate = result.penaltyEndDate.split(" ");
                                penaltyEndDate.push(new Date(today.setDate(today.getDate() + 3)).toISOString().split(" ")[0]);
                            } else {
                                penalizedDate.push(today.toISOString().split(" ")[0]);
                                penaltyEndDate.push(new Date(today.setDate(today.getDate() + 3)).toISOString().split(" ")[0]);
                            }
                            await this.memberRepository.updateStatus(
                                memberId,
                                MemberStatus.PENALTY,
                                penalizedDate.join(" "),
                                penaltyEndDate.join(" ")
                            )
                            isPenalized = true;
                        }
                    }
                }
                await this.bookRepository.updateStatus(
                    bookId,
                    BookStatus.AVAILABLE,
                    null,
                    null,
                    'return'
                );
                await this.memberRepository.returnBook(memberId, bookId);
                const book = await this.bookRepository.findById(bookId);
                console.info(book)
                return {
                    statusCode: HttpStatus.OK,
                    message: 'Return book successfull',
                    data: {
                        memberId: memberId,
                        book: book,
                        penalty: {
                            isPenalized: isPenalized,
                            penalizedDate: penalizedDate.length > 0 ? penalizedDate.join(" ") : null,
                            penaltyEndDate: penaltyEndDate.length > 0 ? penaltyEndDate.join(" ") : null,
                            reason: "Overdue return",
                        }
                    }
                }
            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Member not borrowed this book',
                    data: null
                }
            }
        } catch (error) {
            throw new Error(`Failed to return book: ${error.message}`);
        }
    }
}
