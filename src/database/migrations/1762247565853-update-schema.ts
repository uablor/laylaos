import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1762247565853 implements MigrationInterface {
    name = 'UpdateSchema1762247565853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` DROP FOREIGN KEY \`FK_5ae386c2ea0cff6d7bb11c609f3\``);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` DROP FOREIGN KEY \`FK_7d84aaeedd6b9fa4cac3e966ed1\``);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` CHANGE \`key\` \`key\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` CHANGE \`hotelId\` \`hotelId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` CHANGE \`roomTypeId\` \`roomTypeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`room_types\` DROP FOREIGN KEY \`FK_d5b28cff7295a9de224a3bd9911\``);
        await queryRunner.query(`ALTER TABLE \`room_types\` CHANGE \`hotel_id\` \`hotel_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_44342bfa812465df91df3d9a152\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_cbd0eedd8fe9da9bc391902e70a\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`booking_code\` \`booking_code\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`customer_name\` \`customer_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`customer_tel\` \`customer_tel\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`created_by\` \`created_by\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`updated_by\` \`updated_by\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` DROP FOREIGN KEY \`FK_be5cd3c6d04d0ce156fcadd7e72\``);
        await queryRunner.query(`ALTER TABLE \`booking_details\` DROP FOREIGN KEY \`FK_57f3269d238d3af5420e6e4fe89\``);
        await queryRunner.query(`ALTER TABLE \`booking_details\` CHANGE \`checkin_date\` \`checkin_date\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` CHANGE \`checkout_date\` \`checkout_date\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` CHANGE \`booking_id\` \`booking_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` CHANGE \`room_id\` \`room_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_8a380bdc519b8701daf0ec62da0\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_7a61484af364d0d804b21b25c7f\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`room_amenities\` \`room_amenities\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`room_type_id\` \`room_type_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`hotel_id\` \`hotel_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` DROP FOREIGN KEY \`FK_656dce2a8012700e598a45cfd3f\``);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`logo\` \`logo\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`email_hotel\` \`email_hotel\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`zone_id\` \`zone_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` ADD CONSTRAINT \`FK_5ae386c2ea0cff6d7bb11c609f3\` FOREIGN KEY (\`hotelId\`) REFERENCES \`hotels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` ADD CONSTRAINT \`FK_7d84aaeedd6b9fa4cac3e966ed1\` FOREIGN KEY (\`roomTypeId\`) REFERENCES \`room_types\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_types\` ADD CONSTRAINT \`FK_d5b28cff7295a9de224a3bd9911\` FOREIGN KEY (\`hotel_id\`) REFERENCES \`hotels\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_44342bfa812465df91df3d9a152\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_cbd0eedd8fe9da9bc391902e70a\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` ADD CONSTRAINT \`FK_be5cd3c6d04d0ce156fcadd7e72\` FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` ADD CONSTRAINT \`FK_57f3269d238d3af5420e6e4fe89\` FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_8a380bdc519b8701daf0ec62da0\` FOREIGN KEY (\`room_type_id\`) REFERENCES \`room_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_7a61484af364d0d804b21b25c7f\` FOREIGN KEY (\`hotel_id\`) REFERENCES \`hotels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hotels\` ADD CONSTRAINT \`FK_656dce2a8012700e598a45cfd3f\` FOREIGN KEY (\`zone_id\`) REFERENCES \`zones\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`hotels\` DROP FOREIGN KEY \`FK_656dce2a8012700e598a45cfd3f\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_7a61484af364d0d804b21b25c7f\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_8a380bdc519b8701daf0ec62da0\``);
        await queryRunner.query(`ALTER TABLE \`booking_details\` DROP FOREIGN KEY \`FK_57f3269d238d3af5420e6e4fe89\``);
        await queryRunner.query(`ALTER TABLE \`booking_details\` DROP FOREIGN KEY \`FK_be5cd3c6d04d0ce156fcadd7e72\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_cbd0eedd8fe9da9bc391902e70a\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_44342bfa812465df91df3d9a152\``);
        await queryRunner.query(`ALTER TABLE \`room_types\` DROP FOREIGN KEY \`FK_d5b28cff7295a9de224a3bd9911\``);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` DROP FOREIGN KEY \`FK_7d84aaeedd6b9fa4cac3e966ed1\``);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` DROP FOREIGN KEY \`FK_5ae386c2ea0cff6d7bb11c609f3\``);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`zone_id\` \`zone_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`email_hotel\` \`email_hotel\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`logo\` \`logo\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`hotels\` ADD CONSTRAINT \`FK_656dce2a8012700e598a45cfd3f\` FOREIGN KEY (\`zone_id\`) REFERENCES \`zones\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`hotel_id\` \`hotel_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`room_type_id\` \`room_type_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`room_amenities\` \`room_amenities\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_7a61484af364d0d804b21b25c7f\` FOREIGN KEY (\`hotel_id\`) REFERENCES \`hotels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_8a380bdc519b8701daf0ec62da0\` FOREIGN KEY (\`room_type_id\`) REFERENCES \`room_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` CHANGE \`room_id\` \`room_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` CHANGE \`booking_id\` \`booking_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` CHANGE \`checkout_date\` \`checkout_date\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` CHANGE \`checkin_date\` \`checkin_date\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` ADD CONSTRAINT \`FK_57f3269d238d3af5420e6e4fe89\` FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking_details\` ADD CONSTRAINT \`FK_be5cd3c6d04d0ce156fcadd7e72\` FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`updated_by\` \`updated_by\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`created_by\` \`created_by\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`customer_tel\` \`customer_tel\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`customer_name\` \`customer_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`booking_code\` \`booking_code\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_cbd0eedd8fe9da9bc391902e70a\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_44342bfa812465df91df3d9a152\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_types\` CHANGE \`hotel_id\` \`hotel_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`room_types\` ADD CONSTRAINT \`FK_d5b28cff7295a9de224a3bd9911\` FOREIGN KEY (\`hotel_id\`) REFERENCES \`hotels\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` CHANGE \`roomTypeId\` \`roomTypeId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` CHANGE \`hotelId\` \`hotelId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` CHANGE \`key\` \`key\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` ADD CONSTRAINT \`FK_7d84aaeedd6b9fa4cac3e966ed1\` FOREIGN KEY (\`roomTypeId\`) REFERENCES \`room_types\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`image_orm_entity\` ADD CONSTRAINT \`FK_5ae386c2ea0cff6d7bb11c609f3\` FOREIGN KEY (\`hotelId\`) REFERENCES \`hotels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
