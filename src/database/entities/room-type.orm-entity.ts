// src/database/entities/room-type.orm-entity.ts
import { Entity, Column, OneToMany, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import { RoomOrmEntity } from './room.orm-entity';
import { HotelOrmEntity } from './hotel.orm-entity';
import { ImageOrmEntity } from './image.orm-entity';

@Entity('room_types')
export class RoomTypeOrmEntity extends ShardOrmEntity {
  @Column({ length: 255 })
  name: string;

  @OneToMany(() => RoomOrmEntity, (room) => room.room_type)
  rooms: RoomOrmEntity[];

  @ManyToOne(() => HotelOrmEntity, (hotel) => hotel.room_types, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelOrmEntity;

  @OneToMany(() => ImageOrmEntity, (image) => image.room_type , { cascade: true })
  images: ImageOrmEntity[];
}
