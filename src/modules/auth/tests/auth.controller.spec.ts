/* eslint-disable @typescript-eslint/no-empty-function */
import { Test } from '@nestjs/testing';
import { CreateUserDto } from 'src/modules/user/dtos/createUser.dto';
import { ResponseIdDto } from 'src/shared/dtos/responseId.dto';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AccessTokenDto } from '../dtos/accessToken.dto';
import { LoginDto } from '../dtos/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  class AuthServiceFake {
    public async register(): Promise<ResponseIdDto> {
      return {
        id: 'any_id',
      };
    }

    public async login(): Promise<AccessTokenDto> {
      return {
        accessToken: 'any_token',
      };
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
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceFake,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(AuthController).toBeDefined();
  });

  describe('register', () => {
    test('should return a valid response', async () => {
      const createUserDto = makeCreateUserDto();
      const result = await authController.register(createUserDto);
      expect(result).toEqual({ id: 'any_id' });
    });

    test('should throw if authService.register throws', async () => {
      const createUserDto = makeCreateUserDto();
      jest.spyOn(authService, 'register').mockRejectedValueOnce(new Error());
      const result = authController.register(createUserDto);
      expect(result).rejects.toThrow();
    });
  });

  describe('login', () => {
    test('should return a valid response', async () => {
      const loginDto = makeLoginDto();
      const result = await authController.login(loginDto);
      expect(result).toEqual({ accessToken: 'any_token' });
    });

    test('should throw if authService.login throws', async () => {
      const loginDto = makeLoginDto();
      jest.spyOn(authService, 'login').mockRejectedValueOnce(new Error());
      const result = authController.login(loginDto);
      expect(result).rejects.toThrow();
    });
  });
});
