import { Test } from '@nestjs/testing';
import { UserController } from '../user.controller';

describe('UserController', () => {
  beforeEach(async () => {
    await Test.createTestingModule({
      controllers: [UserController],
    }).compile();
  });

  test('should be defined', () => {
    expect(UserController).toBeDefined();
  });
});
