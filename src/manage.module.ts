import { Module } from '@nestjs/common';
import { ZoneController } from './controllers/zone.controller';
import { RoleController } from './controllers/role.controller';
import { ZoneRepository } from './repositories/zone.repository';
import { RoleRepository } from './repositories/role.repository';
import { ZoneService } from './services/zone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZoneOrmEntity } from './database/entities/zone.orm-entity';
import { RoleOrmEntity } from './database/entities/role.orm-entity';
import { RoleService } from './services/role.service';
import { HotelOrmEntity } from './database/entities/hotel.orm-entity';
import { RoomTypeOrmEntity } from './database/entities/room-type.orm-entity';
import { RoomOrmEntity } from './database/entities/room.orm-entity';
import { UserOrmEntity } from './database/entities/user.orm-entity';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { RoomTypeController } from './controllers/room-type.controller';
import { RoomTypeService } from './services/room-type.service';
import { RoomTypeRepository } from './repositories/room-type.repository';
import { HotelController } from './controllers/hotel.controller';
import { HotelService } from './services/hotel.service';
import { HotelRepository } from './repositories/hotel.repository';
import { RoomController } from './controllers/room.controller';
import { RoomService } from './services/room.service';
import { RoomRepository } from './repositories/room.repository';
import { SearchController } from './controllers/search.controller';
import { SearchRepository } from './repositories/search.repository';
import { SearchService } from './services/search.service';
import { BookingDetailService } from './services/booking-detail.service';
import { BookingDetailRepository } from './repositories/booking-detail.repository';
import { BookingService } from './services/booking.service';
import { BookingRepository } from './repositories/booking.repository';
import { BookingDetailOrmEntity } from './database/entities/booking-detail.orm-entity';
import { BookingOrmEntity } from './database/entities/booking.orm-entity';
import { BookingDetailController } from './controllers/booking-detail.controller';
import { BookingController } from './controllers/booking.controller';
import { ReportController } from './controllers/report.controller';
import { ReportRepository } from './repositories/report.repository';
import { ReportService } from './services/report.service';
import { ImageController } from './controllers/images.controller';
import { ImageRepository } from './repositories/image.repository';
import { ImageService } from './services/image.service';
import { ImageOrmEntity } from './database/entities/image.orm-entity';
import { GlobalCacheService } from './services/cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ZoneOrmEntity,
      RoleOrmEntity,
      HotelOrmEntity,
      RoomTypeOrmEntity,
      RoomOrmEntity,
      UserOrmEntity,
      BookingDetailOrmEntity,
      BookingOrmEntity,
      ImageOrmEntity,
    ]),
  ],
  controllers: [
    ZoneController,
    RoleController,
    UserController,
    RoomTypeController,
    HotelController,
    RoomController,
    SearchController,
    BookingDetailController,
    BookingController,
    ReportController,
    ImageController,
  ],
  providers: [
    ZoneRepository,
    ZoneService,

    RoleRepository,
    RoleService,

    UserRepository,
    UserService,

    RoomTypeRepository,
    RoomTypeService,

    HotelService,
    HotelRepository,

    RoomService,
    RoomRepository,

    SearchRepository,
    SearchService,

    BookingDetailService,
    BookingDetailRepository,

    BookingService,
    BookingRepository,

    ReportRepository,
    ReportService,

    ImageRepository,
    ImageService,

    GlobalCacheService,
  ],
  exports: [
    ZoneService,
    RoleService,
    RoleRepository,

    RoomTypeService,
    HotelService,
    RoomService,
    SearchService,
    BookingService,
    ImageService,
    GlobalCacheService,
    UserService,
  ],
})
export class ManageModule {}
