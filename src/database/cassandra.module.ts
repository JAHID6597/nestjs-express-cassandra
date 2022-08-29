import { Module } from '@nestjs/common';
import { ExpressCassandraModule } from '@iaminfinity/express-cassandra';
import { CassandraOptionFactoryService } from './cassandra.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ExpressCassandraModule.forRootAsync({
      imports: [ConfigModule],
      useClass: CassandraOptionFactoryService,
    }),
  ],
})
export class CassandraModule {}
