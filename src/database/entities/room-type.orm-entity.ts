// src/database/entities/room-type.orm-entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import { RoomOrmEntity } from './room.orm-entity';

@Entity('room_types')
export class RoomTypeOrmEntity extends ShardOrmEntity {
  @Column({ length: 255 })
  name: string;

  @OneToMany(() => RoomOrmEntity, (room) => room.room_type)
  rooms: RoomOrmEntity[];
}
