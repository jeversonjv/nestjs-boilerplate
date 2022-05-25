import { Test } from '@nestjs/testing';
import { UserController } from '../user.controller';

describe('UserController', () => {
  beforeEach(async () => {
    await Test.createTestingModule({
      controllers: [UserController],
    }).compile();
  });

  test('Should be defined', () => {
    expect(UserController).toBeDefined();
  });
});
