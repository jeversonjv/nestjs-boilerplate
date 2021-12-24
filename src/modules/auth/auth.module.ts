import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Env } from 'src/shared/helpers/env.helper';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: Env.getString('JWT_SECRET'),
      signOptions: { expiresIn: Env.getString('JWT_EXPIRESIN') },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
