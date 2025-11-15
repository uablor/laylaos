// src/database/entities/room.orm-entity.ts
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import { RoomTypeOrmEntity } from './room-type.orm-entity';
import { HotelOrmEntity } from './hotel.orm-entity';
import { RoomStatus } from 'src/common/enum/status-room.enum';
import { BookingDetailOrmEntity } from './booking-detail.orm-entity';

@Entity('rooms')
export class RoomOrmEntity extends ShardOrmEntity {
  @Column({ length: 50 })
  room_number: string;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => RoomTypeOrmEntity, { eager: true })
  @JoinColumn({ name: 'room_type_id' })
  room_type: RoomTypeOrmEntity;

  @Column('double')
  price: number;

  @Column('double')
  brokerage_fees: number;

  @Column('int')
  floor: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  room_amenities: string;

  @ManyToOne(() => HotelOrmEntity, { eager: true })
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelOrmEntity;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @OneToMany(() => BookingDetailOrmEntity, (bookingDetail) => bookingDetail.room)
  details: BookingDetailOrmEntity[];
}
