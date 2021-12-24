import { Body, Controller, Post } from '@nestjs/common';
import { ResponseIdDto } from 'src/shared/dtos/responseId.dto';
import { CreateUserDto } from '../user/dtos/createUser.dto';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dtos/accessToken.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUser: CreateUserDto): Promise<ResponseIdDto> {
    return await this.authService.register(createUser);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AccessTokenDto> {
    return await this.authService.login(loginDto);
  }
}
