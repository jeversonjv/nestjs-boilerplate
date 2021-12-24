import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Env } from 'src/shared/helpers/env.helper';
import { JwtPayload } from '../dtos/jwtPayload.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Env.getString('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<Partial<User>> {
    const { id } = payload;

    const user = await this.userService.findOneByCriteria({
      id,
    });

    if (!user) throw new UnauthorizedException('token invalid');

    delete user.password;

    return user;
  }
}
