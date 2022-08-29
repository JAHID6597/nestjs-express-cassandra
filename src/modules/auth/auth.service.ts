import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUser(userDto: AuthUserDto) {
    const user = await firstValueFrom(
      this.userService.findUserByUsername(userDto.username),
    );
    if (!user) throw new BadRequestException('Invalid credentials.');
    const passwordValid = await bcrypt.compare(userDto.password, user.password);
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async loginUser(user: any) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtTokenService.sign(payload),
    };
  }
}
