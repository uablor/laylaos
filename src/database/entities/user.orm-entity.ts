import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import { RoleOrmEntity } from './role.orm-entity';
import { HotelOrmEntity } from './hotel.orm-entity';

@Entity('users')
export class UserOrmEntity extends ShardOrmEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToMany(() => RoleOrmEntity, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RoleOrmEntity[];

  @ManyToMany(() => HotelOrmEntity, (hotel) => hotel.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'user_hotel',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'hotel_id',
      referencedColumnName: 'id',
    },
  })
  hotels: HotelOrmEntity[];
}
