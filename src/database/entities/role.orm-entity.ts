
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import {
  Entity,
  Column,
  ManyToMany,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('roles')
export class RoleOrmEntity extends ShardOrmEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => UserOrmEntity, (user) => user.roles)
  users: UserOrmEntity[];
}
