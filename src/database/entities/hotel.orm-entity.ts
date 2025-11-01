// src/database/entities/hotel.orm-entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import { ZoneOrmEntity } from './zone.orm-entity';
import { UserOrmEntity } from './user.orm-entity';
import { RoomOrmEntity } from './room.orm-entity';

@Entity('hotels')
export class HotelOrmEntity extends ShardOrmEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 50, nullable: false })
  tel: string;

  @Column({ length: 100, nullable: true })
  email_hotel: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @ManyToOne(() => ZoneOrmEntity, (zone) => zone.hotels, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneOrmEntity;

  @Column({ type: 'int' })
  floor: number;

  @ManyToMany(() => UserOrmEntity, (user) => user.hotels)
  users: UserOrmEntity[];

  @OneToMany(() => RoomOrmEntity, (room) => room.hotel)
  rooms: RoomOrmEntity[];
}
