import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { HotelOrmEntity } from './hotel.orm-entity';
import { RoomTypeOrmEntity } from './room-type.orm-entity';

@Entity()
export class ImageOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @Column({ nullable: true })
  key: string;

  @ManyToOne(() => HotelOrmEntity, (ht) => ht.images)
  hotel: HotelOrmEntity;

  @ManyToOne(() => RoomTypeOrmEntity, (roomType) => roomType.images, {
    onDelete: 'CASCADE',
  })
  room_type: RoomTypeOrmEntity;

  @OneToOne(() => HotelOrmEntity, (hotel) => hotel.logo, { cascade: true, onDelete: 'CASCADE' })
  hotel_logo: HotelOrmEntity;
}
