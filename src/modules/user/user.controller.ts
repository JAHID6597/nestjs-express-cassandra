import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { types } from '@iaminfinity/express-cassandra';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPayload } from '../auth/user-payload';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UpdateResponseDto } from 'src/dtos/update-response.dto';
import { DeleteResponseDto } from 'src/dtos/delete-response.dto';

@ApiTags('User APIs')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @ApiOkResponse({ type: [UserResponseDto] })
  @HttpCode(HttpStatus.OK)
  @Get()
  public getUsers() {
    return this.userService.findUsers();
  }

  @ApiOkResponse({ type: UserResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getUser(@Param('id') id: string | types.Uuid) {
    const user = await firstValueFrom(this.userService.findUserById(id));
    if (!user) throw new NotFoundException(`No such user exists by id=${id}`);
    return user;
  }

  @ApiOkResponse({ type: CreateUserDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createUser(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }

  @ApiOkResponse({ type: LoginResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginUser(@Body() userDto: AuthUserDto) {
    const user = await firstValueFrom(
      this.userService.findUserByUsername(userDto.username),
    );
    if (!user)
      throw new NotFoundException(
        `No such user exists by username=${userDto.username}`,
      );
    return this.authService.loginUser(user);
  }

  @ApiOkResponse({ type: UpdateResponseDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('update/:id')
  public updateUser(
    @Param('id') id: string | types.Uuid,
    @Body() body: UpdateUserDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.userService.updateUser(id, body, user);
  }

  @ApiOkResponse({ type: DeleteResponseDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  public deleteUser(@Param('id') id: string | types.Uuid) {
    return this.userService.deleteUser(id);
  }
}
