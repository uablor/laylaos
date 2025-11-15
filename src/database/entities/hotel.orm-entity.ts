// src/database/entities/hotel.orm-entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import { ZoneOrmEntity } from './zone.orm-entity';
import { UserOrmEntity } from './user.orm-entity';
import { RoomOrmEntity } from './room.orm-entity';
import { RoomTypeOrmEntity } from './room-type.orm-entity';
import { ImageOrmEntity } from './image.orm-entity';

@Entity('hotels')
export class HotelOrmEntity extends ShardOrmEntity {
  @Column({ length: 255 })
  name: string;

  @OneToOne(() => ImageOrmEntity, (img) => img.hotel_logo, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  logo: ImageOrmEntity;

  @Column({ type: 'time', nullable: true })
  start_time: string;

  @Column({ type: 'time', nullable: true })
  end_time: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 50, nullable: false })
  tel: string;

  @Column({ length: 100, nullable: true })
  email_hotel: string;

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

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @OneToMany(() => RoomTypeOrmEntity, (roomType) => roomType.hotel)
  room_types: RoomTypeOrmEntity[];

  @OneToMany(() => ImageOrmEntity, (im) => im.hotel)
  images: ImageOrmEntity[];
}
