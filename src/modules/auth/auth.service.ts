import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseIdDto } from 'src/shared/dtos/responseId.dto';
import { CreateUserDto } from '../user/dtos/createUser.dto';
import { UserService } from '../user/user.service';
import { AccessTokenDto } from './dtos/accessToken.dto';
import { JwtPayload } from './dtos/jwtPayload.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<ResponseIdDto> {
    this.logger.debug('register');
    return await this.userService.createUser(createUserDto);
  }

  async login(loginDto: LoginDto): Promise<AccessTokenDto> {
    this.logger.debug('login');

    const user = await this.userService.findOneByCriteria({
      email: loginDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Credentials invalid');
    }

    const isValid = user.validatePassword(loginDto.password);
    if (!isValid) {
      throw new UnauthorizedException('Credentials invalid');
    }

    const payload: JwtPayload = {
      id: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
