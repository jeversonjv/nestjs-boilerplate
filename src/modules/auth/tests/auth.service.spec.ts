/* eslint-disable @typescript-eslint/no-empty-function */
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from 'src/modules/user/dtos/createUser.dto';
import { ResponseIdDto } from 'src/shared/dtos/responseId.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dtos/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  class UserServiceFake {
    public async createUser(): Promise<ResponseIdDto> {
      return {
        id: 'any_id',
      };
    }
    public async findOneByCriteria(): Promise<void> {}
  }

  class JwtServiceFake {
    public sign(): string {
      return 'any_token';
    }
  }

  const makeCreateUserDto = (): CreateUserDto => ({
    email: 'any_mail@mail.com',
    password: 'any_password',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
  });

  const makeLoginDto = (): LoginDto => ({
    email: 'any_mail@mail.com',
    password: 'any_password',
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useClass: UserServiceFake },
        { provide: JwtService, useClass: JwtServiceFake },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  test('should be defined', () => {
    expect(AuthService).toBeDefined();
  });

  describe('register', () => {
    test('Should call userService.create once time and pass correct values', async () => {
      const createUserSpy = jest.spyOn(userService, 'createUser');
      await authService.register(makeCreateUserDto());
      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(makeCreateUserDto());
    });

    test('Should throw if userService.create throws', async () => {
      jest.spyOn(userService, 'createUser').mockRejectedValueOnce(new Error());
      const promise = authService.register(makeCreateUserDto());
      expect(promise).rejects.toThrow();
    });

    test('Should return an object with id when create a user', async () => {
      const result = await authService.register(makeCreateUserDto());
      expect(result).toEqual({ id: 'any_id' });
    });
  });

  describe('login', () => {
    test('Should call dependencies with correct values and return accessToken', async () => {
      const loginDto = makeLoginDto();

      const findOneByCriteriaSpy = jest
        .spyOn(userService, 'findOneByCriteria')
        .mockResolvedValueOnce(
          new User({ ...makeCreateUserDto(), id: 'any_id' }),
        );

      const validatePasswordSpy = jest
        .spyOn(User.prototype, 'validatePassword')
        .mockReturnValueOnce(true);

      const signSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue('any_token');

      const response = await authService.login(loginDto);

      expect(findOneByCriteriaSpy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(validatePasswordSpy).toHaveBeenCalledWith(loginDto.password);
      expect(signSpy).toHaveBeenCalledWith({
        id: 'any_id',
      });
      expect(response).toEqual({
        accessToken: 'any_token',
      });
    });

    test('Should throw when user is not found', () => {
      jest.spyOn(userService, 'findOneByCriteria').mockResolvedValueOnce(null);
      const promise = authService.login(makeLoginDto());
      expect(promise).rejects.toThrow(
        new UnauthorizedException('Credentials invalid'),
      );
    });

    test('Should throw when password is wrong', () => {
      jest
        .spyOn(userService, 'findOneByCriteria')
        .mockResolvedValueOnce(
          new User({ ...makeCreateUserDto(), id: 'any_id' }),
        );

      jest.spyOn(User.prototype, 'validatePassword').mockReturnValueOnce(false);

      const promise = authService.login(makeLoginDto());
      expect(promise).rejects.toThrow(
        new UnauthorizedException('Credentials invalid'),
      );
    });

    test('Should throw if jwtService.sign throws', () => {
      const loginDto = makeLoginDto();

      jest
        .spyOn(userService, 'findOneByCriteria')
        .mockResolvedValueOnce(
          new User({ ...makeCreateUserDto(), id: 'any_id' }),
        );

      jest.spyOn(User.prototype, 'validatePassword').mockReturnValueOnce(true);

      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new Error();
      });

      const promise = authService.login(loginDto);

      expect(promise).rejects.toThrow();
    });
  });
});
