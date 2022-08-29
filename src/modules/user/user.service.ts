import {
  InjectRepository,
  isUuid,
  types,
  uuid,
} from '@iaminfinity/express-cassandra';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from '@iaminfinity/express-cassandra';
import { firstValueFrom, Observable } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPayload } from '../auth/user-payload';
import { UpdateResponseDto } from 'src/dtos/update-response.dto';
import { DeleteResponseDto } from 'src/dtos/delete-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public findUserById(id: string | types.Uuid): Observable<UserEntity> {
    id = isUuid(id) ? id : uuid(id);
    return this.userRepository.findOne({ id }, { raw: true });
  }

  public findUserByUsername(username: string): Observable<UserEntity> {
    return this.userRepository.findOne(
      { username },
      { allow_filtering: true, raw: true },
    );
  }

  public findUsers(): Observable<UserEntity[]> {
    return this.userRepository.find({}, { raw: true });
  }

  async createUser(userDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    userDto.password = hashedPassword;
    const user = this.userRepository.create(userDto);
    return this.userRepository.save(user);
  }

  async updateUser(
    id: string | types.Uuid,
    body: UpdateUserDto,
    authUser: UserPayload,
  ) {
    id = isUuid(id) ? id : uuid(id);
    const user = await firstValueFrom(this.findUserById(id));
    if (!user) throw new NotFoundException(`No such user exists by id=${id}`);

    body.updated_by = authUser.user_id;
    const updated = await firstValueFrom(
      this.userRepository.update({ id }, body),
    );
    const isUpdated = updated.rows[0]['[applied]'];

    const response = new UpdateResponseDto(id.toString());
    response.is_updated = isUpdated;
    response.message = response.is_updated
      ? 'Successfully updated.'
      : 'Update failed.';

    return response;
  }

  async deleteUser(id: string | types.Uuid) {
    id = isUuid(id) ? id : uuid(id);
    const user = await firstValueFrom(this.findUserById(id));

    const deletePostResponse = new DeleteResponseDto();
    if (user) {
      await firstValueFrom(this.userRepository.delete({ id }));
      deletePostResponse.is_success = true;
      deletePostResponse.message = 'Successfully deleted';
    } else {
      deletePostResponse.is_success = false;
      deletePostResponse.message = `Not found any user with this id="${id}"`;
    }

    return deletePostResponse;
  }
}
