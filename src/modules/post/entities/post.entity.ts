import {
  Column,
  CreateDateColumn,
  Entity,
  GeneratedUUidColumn,
  UpdateDateColumn,
} from '@iaminfinity/express-cassandra';

@Entity({
  table_name: 'posts',
  key: ['id'],
})
export class PostEntity {
  @GeneratedUUidColumn()
  id: any;

  @Column({
    type: 'text',
  })
  title: string;

  @Column({
    type: 'text',
  })
  body: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'text' })
  created_by: string;

  @Column({ type: 'text' })
  updated_by: string;

  @Column({ type: 'boolean', default: () => true })
  is_active: boolean;
}
