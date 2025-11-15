// src/database/entities/booking.orm-entity.ts
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import { UserOrmEntity } from './user.orm-entity';
import { BookingDetailOrmEntity } from './booking-detail.orm-entity';
import { PaymentStatus } from 'src/common/enum/payment-status.enum';

@Entity('bookings')
export class BookingOrmEntity extends ShardOrmEntity {

  @Column({ length: 255, nullable: true })
  booking_code: string;
  @Column({ length: 255, nullable: true })
  customer_name: string;

  @Column({ length: 50, nullable: true })
  customer_tel: string;

  @ManyToOne(() => UserOrmEntity, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by: UserOrmEntity;

  @Column({ type: 'date' })
  booking_date: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.SUCCESS,
  })
  payment_status: PaymentStatus;

  @OneToMany(() => BookingDetailOrmEntity, (detail) => detail.booking, {
    cascade: true,
  })
  details: BookingDetailOrmEntity[];
}
