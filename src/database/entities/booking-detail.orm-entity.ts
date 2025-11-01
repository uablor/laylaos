// src/database/entities/booking-detail.orm-entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import { BookingOrmEntity } from './booking.orm-entity';
import { RoomOrmEntity } from './room.orm-entity';

@Entity('booking_details')
export class BookingDetailOrmEntity extends ShardOrmEntity {
  @ManyToOne(() => BookingOrmEntity, (booking) => booking.details)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingOrmEntity;

  @ManyToOne(() => RoomOrmEntity, { eager: true })
  @JoinColumn({ name: 'room_id' })
  room: RoomOrmEntity;

  @Column('double')
  brokerage_fees: number;

  @Column('double')
  price: number;

  @Column('int')
  qty: number;

  @Column('double')
  total: number;

  @Column({ type: 'date', nullable: true })
  checkin_date: Date;

  @Column({ type: 'date', nullable: true })
  checkout_date: Date;
}
