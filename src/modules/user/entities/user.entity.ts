import {
  Column,
  CreateDateColumn,
  Entity,
  GeneratedUUidColumn,
  UpdateDateColumn,
} from '@iaminfinity/express-cassandra';

@Entity({
  table_name: 'users',
  key: ['id'],
})
export class UserEntity {
  @GeneratedUUidColumn()
  id: any;

  @Column({
    type: 'text',
  })
  username: string;

  @Column({
    type: 'text',
  })
  password: string;

  @Column({
    type: 'text',
  })
  firstname: string;

  @Column({
    type: 'text',
  })
  lastname: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'text' })
  updated_by: string;

  @Column({ type: 'boolean', default: () => true })
  is_active: boolean;
}
