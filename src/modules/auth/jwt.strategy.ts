import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';
import { Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const user = await firstValueFrom(
      this.userService.findUserByUsername(payload.username),
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return { user_id: payload.sub, username: payload.username };
  }
}
