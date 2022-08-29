import {
  InjectRepository,
  isUuid,
  Repository,
  types,
  uuid,
} from '@iaminfinity/express-cassandra';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserPayload } from '../auth/user-payload';
import { CreatePostDto } from './dto/create-post.dto';
import { DeleteResponseDto } from '../../dtos/delete-response.dto';
import { UpdateResponseDto } from '../../dtos/update-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  public findPostById(id: string | types.Uuid) {
    id = isUuid(id) ? id : uuid(id);
    return this.postRepository.findOne({ id }, { raw: true });
  }

  public getPosts() {
    return this.postRepository.find({}, { raw: true });
  }

  public createPost(postDto: CreatePostDto, user: UserPayload) {
    postDto.created_by = user.user_id;
    const post = this.postRepository.create(postDto);
    return this.postRepository.save(post);
  }

  async updatePost(
    id: string | types.Uuid,
    body: UpdatePostDto,
    user: UserPayload,
  ) {
    id = isUuid(id) ? id : uuid(id);
    const post = await firstValueFrom(this.findPostById(id));
    if (!post) throw new NotFoundException(`No such post exists by id=${id}`);

    body.updated_by = user.user_id;
    const updated = await firstValueFrom(
      this.postRepository.update({ id }, body),
    );
    const isUpdated = updated.rows[0]['[applied]'];

    const response = new UpdateResponseDto(id.toString());
    response.is_updated = isUpdated;
    response.message = response.is_updated
      ? 'Successfully updated.'
      : 'Update failed.';

    return response;
  }

  async deletePost(id: string | types.Uuid) {
    id = isUuid(id) ? id : uuid(id);
    const post = await firstValueFrom(this.findPostById(id));

    const deletePostResponse = new DeleteResponseDto();
    if (post) {
      await firstValueFrom(
        this.postRepository.delete({ id }, { if_exists: true }),
      );
      deletePostResponse.is_success = true;
      deletePostResponse.message = 'Successfully deleted';
    } else {
      deletePostResponse.is_success = false;
      deletePostResponse.message = `Not found any post with this id="${id}"`;
    }

    return deletePostResponse;
  }
}
