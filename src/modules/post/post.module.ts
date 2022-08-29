import { ExpressCassandraModule } from '@iaminfinity/express-cassandra';
import { Module } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [ExpressCassandraModule.forFeature([PostEntity])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
