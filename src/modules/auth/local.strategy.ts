import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super();
  }

  async validate(userDto: AuthUserDto) {
    const user = await this.authService.validateUser(userDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
