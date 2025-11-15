
import { Entity, Column, OneToMany } from 'typeorm';
import { ShardOrmEntity } from 'src/common/entities/base.orm-entity';
import { HotelOrmEntity } from './hotel.orm-entity';

@Entity('zones')
export class ZoneOrmEntity extends ShardOrmEntity {
  @Column({ length: 255 })
  name: string;

  @OneToMany(() => HotelOrmEntity, (hotel) => hotel.zone)
  hotels: HotelOrmEntity[];
}
