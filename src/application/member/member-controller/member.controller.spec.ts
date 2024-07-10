import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from 'src/domain/member/services/member/member.service';

describe('MemberController', () => {
  let controller: MemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [MemberService],
    }).compile();

    controller = module.get<MemberController>(MemberController);
  });

  it('should be return "Hello Yanuar Fauzan" in json', () => {
    const response = controller.getAllMember();
    expect(response).toEqual({ data: 'Hello Yanuar Fauzan'});
  });
});
