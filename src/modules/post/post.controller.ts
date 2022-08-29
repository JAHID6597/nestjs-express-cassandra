import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPayload } from '../auth/user-payload';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { firstValueFrom } from 'rxjs';
import { DeleteResponseDto } from 'src/dtos/delete-response.dto';
import { UpdateResponseDto } from 'src/dtos/update-response.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { NotFoundException } from '@nestjs/common';

@ApiTags('Post APIs')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOkResponse({ type: [PostResponseDto] })
  @HttpCode(HttpStatus.OK)
  @Get()
  public getPosts() {
    return this.postService.getPosts();
  }

  @ApiOkResponse({ type: PostResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  public async getPost(@Param('id') id: string) {
    const post = await firstValueFrom(this.postService.findPostById(id));
    if (!post) throw new NotFoundException(`No such post exists by id=${id}`);

    return post;
  }

  @ApiOkResponse({ type: CreatePostDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  public createPost(
    @Body() body: CreatePostDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.postService.createPost(body, user);
  }

  @ApiOkResponse({ type: UpdateResponseDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('update/:id')
  public async updatePost(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @CurrentUser() user: UserPayload,
  ) {
    return await this.postService.updatePost(id, body, user);
  }

  @ApiOkResponse({ type: DeleteResponseDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  public deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
