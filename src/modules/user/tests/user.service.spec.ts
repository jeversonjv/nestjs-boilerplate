/* eslint-disable @typescript-eslint/no-empty-function */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  class UserRepositoryFake {
    public create(): void {}
    public async save(): Promise<void> {}
    public async remove(): Promise<void> {}
    public async findOne(): Promise<void> {}
  }

  const makeCreateUserDto = (): CreateUserDto => ({
    email: 'any_mail@mail.com',
    password: 'any_password',
    firstName: 'any_firstname',
    lastName: 'any_lastname',
  });

  const makeSavedData = (): {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  } => ({
    id: 'any_id',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useClass: UserRepositoryFake,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  test('should be defined', () => {
    expect(UserService).toBeDefined();
  });

  describe('findOneByCriteria', () => {
    test('Should throw when findOne throws', () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOne');
      findOneSpy.mockRejectedValueOnce(new Error());
      const promise = userService.findOneByCriteria({});
      expect(promise).rejects.toThrow();
    });
  });

  describe('createUser', () => {
    test('Should call with correct params and create user', async () => {
      const createUserDto = makeCreateUserDto();

      const fakeUserEntity = new User({
        ...makeSavedData(),
        ...createUserDto,
      });

      const findOneByCriteriaSpy = jest.spyOn(userService, 'findOneByCriteria');

      const createSpy = jest
        .spyOn(userRepository, 'create')
        .mockReturnValue(fakeUserEntity);

      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(fakeUserEntity);

      const result = await userService.createUser(createUserDto);

      expect(findOneByCriteriaSpy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(createSpy).toHaveBeenCalledWith(createUserDto);
      expect(saveSpy).toHaveBeenCalledWith(fakeUserEntity);
      expect(result).toEqual({ id: fakeUserEntity.id });
    });

    test('Should throw if user with email already exists', async () => {
      const createUserDto = makeCreateUserDto();

      try {
        const findOneByCriteriaSpy = jest.spyOn(
          userService,
          'findOneByCriteria',
        );
        findOneByCriteriaSpy.mockResolvedValueOnce(new User({}));
        await userService.createUser(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `User with email ${createUserDto.email} already exists.`,
        );
      }
    });
  });
});
