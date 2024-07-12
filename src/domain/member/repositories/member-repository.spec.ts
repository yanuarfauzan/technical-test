import { Test, TestingModule } from '@nestjs/testing';
import { MemberRepository } from './member-repository';
import { PrismaService } from '../../../infrastructure/database/services/prisma/prisma.service';
import { MemberStatus } from '@prisma/client';

describe('MemberRepository', () => {
  let memberRepository: MemberRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        {
          provide: PrismaService,
          useValue: {
            member: {
              findMany: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    memberRepository = module.get<MemberRepository>(MemberRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(memberRepository).toBeDefined();
  });

  it('should return all members', async () => {
    const mockMembers = [
      {
        id: '1',
        code: 'M001',
        name: 'Test Member 1',
        status: 'ACTIVE',
        penalizedDate: null,
        penaltyEndDate: null,
        Book: [],
      },
      {
        id: '2',
        code: 'M002',
        name: 'Test Member 2',
        status: 'ACTIVE',
        penalizedDate: null,
        penaltyEndDate: null,
        Book: [],
      },
    ];
    prismaService.member.findMany = jest.fn().mockResolvedValue(mockMembers);

    const result = await memberRepository.getAllMember();

    expect(result).toEqual(
      mockMembers.map((member) => ({
        id: member.id,
        code: member.code,
        name: member.name,
        status: member.status,
        penalizedDate: member.penalizedDate,
        penaltyEndDate: member.penaltyEndDate,
        borrowedBooksCount: member.Book.length,
      }))
    );
    expect(prismaService.member.findMany).toHaveBeenCalledWith({
      include: {
        Book: true,
      },
    });
  });

  it('should find a member by id', async () => {
    const mockMember = {
      id: '1',
      code: 'M001',
      name: 'Test Member 1',
      status: 'ACTIVE',
      penalizedDate: null,
      penaltyEndDate: null,
      Book: [],
    };
    prismaService.member.findUnique = jest.fn().mockResolvedValue(mockMember);

    const result = await memberRepository.findById('1');

    expect(result).toEqual(mockMember);
    expect(prismaService.member.findUnique).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      include: {
        Book: true,
      },
    });
  });

  it('should update member status', async () => {
    const mockMember = {
      id: '1',
      code: 'M001',
      name: 'Test Member 1',
      status: 'ACTIVE',
      penalizedDate: null,
      penaltyEndDate: null,
    };
    const updatedMember = { ...mockMember, status: 'PENALIZED' };

    prismaService.member.update = jest.fn().mockResolvedValue(updatedMember);

    const result = await memberRepository.updateStatus('1', MemberStatus.PENALTY, '2024-07-11', '2024-07-18');

    expect(result).toEqual(updatedMember);
    expect(prismaService.member.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        status: MemberStatus.PENALTY,
        penalizedDate: '2024-07-11',
        penaltyEndDate: '2024-07-18',
      },
    });
  });

  it('should borrow a book', async () => {
    const mockMember = {
      id: '1',
      code: 'M001',
      name: 'Test Member 1',
      status: 'ACTIVE',
      penalizedDate: null,
      penaltyEndDate: null,
      Book: [],
    };
    const updatedMember = { ...mockMember, Book: [{ id: '1', title: 'Test Book' }] };

    prismaService.member.update = jest.fn().mockResolvedValue(updatedMember);

    const result = await memberRepository.borrowBook('1', '1');

    expect(result).toEqual(updatedMember);
    expect(prismaService.member.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        Book: {
          connect: {
            id: '1',
          },
        },
      },
      include: {
        Book: true,
      },
    });
  });

  it('should return a book', async () => {
    const mockMember = {
      id: '1',
      code: 'M001',
      name: 'Test Member 1',
      status: 'ACTIVE',
      penalizedDate: null,
      penaltyEndDate: null,
      Book: [{ id: '1', title: 'Test Book' }],
    };
    const updatedMember = { ...mockMember, Book: [] };

    prismaService.member.update = jest.fn().mockResolvedValue(updatedMember);

    const result = await memberRepository.returnBook('1', '1');

    expect(result).toEqual(updatedMember);
    expect(prismaService.member.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        Book: {
          disconnect: {
            id: '1',
          },
        },
      },
    });
  });

  it('should get penalized date and penalty end date', async () => {
    const mockPenalizedData = {
      penalizedDate: '2024-07-11',
      penaltyEndDate: '2024-07-18',
    };
    prismaService.member.findUnique = jest.fn().mockResolvedValue(mockPenalizedData);

    const result = await memberRepository.getPenalizedDateAndPenaltyEndDate('1');

    expect(result).toEqual(mockPenalizedData);
    expect(prismaService.member.findUnique).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      select: {
        penalizedDate: true,
        penaltyEndDate: true,
      },
    });
  });
});
