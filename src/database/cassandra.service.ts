import { Injectable } from '@nestjs/common';
import {
  auth,
  ExpressCassandraModuleOptions,
  ExpressCassandraOptionsFactory,
} from '@iaminfinity/express-cassandra';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CassandraOptionFactoryService
  implements ExpressCassandraOptionsFactory
{
  private readonly contactPoints: string[];
  private readonly keyspace: string;
  private readonly user: string;
  private readonly password: string;
  private readonly authProvider: auth.AuthProvider;

  constructor(configService: ConfigService) {
    this.contactPoints = configService.get('CASSANDRA_HOST')
      ? configService.get<string>('CASSANDRA_HOST').split(',')
      : ['localhost'];
    this.keyspace = configService.get('CASSANDRA_KEYSPACE', 'demo_blog_db');
    this.user = configService.get('CASSANDRA_USER', 'cassandra');
    this.password = configService.get('CASSANDRA_PASSWORD', 'cassandra');
    this.authProvider = new auth.PlainTextAuthProvider(
      this.user,
      this.password,
    );
  }

  public createExpressCassandraOptions():
    | ExpressCassandraModuleOptions
    | Promise<ExpressCassandraModuleOptions> {
    return this.getDbConfig();
  }

  public getDbConfig(): any {
    return {
      clientOptions: {
        contactPoints: this.contactPoints,
        keyspace: this.keyspace,
        authProvider: this.authProvider,
      },
      ormOptions: {
        createKeyspace: true,
        migration: 'alter',
      },
    };
  }
}
