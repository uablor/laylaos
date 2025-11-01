import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ใช้ path ให้ตรงกับโครงสร้าง src/database/typeorm/*.ts สำหรับ ts-node
  entities: [join(__dirname, 'entities', '*.orm-entity.{ts,js}')],
  synchronize: false, // ปิดใน production
  logging: process.env.DB_LOGGING === 'true',
  migrationsTableName: 'migrations',
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
