import { DataSource } from 'typeorm';
import { RoleOrmEntity } from '../entities/role.orm-entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { hashPassword } from 'src/common/utils/bcrypt.util';

export async function seedUser(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userRepo = queryRunner.manager.getRepository(UserOrmEntity);
    const roleRepo = queryRunner.manager.getRepository(RoleOrmEntity);

    const adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
    const superAdminRole = await roleRepo.findOne({ where: { name: 'super-admin' } });

    if (!adminRole || !superAdminRole) {
      throw new Error('❌ Missing roles: Please run seedRole() first.');
    }

    const superAdminExists = await userRepo.findOne({
      where: { email: 'superadmin@gmail.com' },
      relations: ['roles'],
    });

    if (!superAdminExists) {
      const userSuperAdmin = userRepo.create({
        first_name: 'Super',
        last_name: 'Admin',
        is_active: true,
        email: 'superadmin@gmail.com',
        password: await hashPassword('11111111'),
        roles: [superAdminRole],
      });
      await userRepo.save(userSuperAdmin);
    }

    const adminExists = await userRepo.findOne({
      where: { email: 'admin@gmail.com' },
      relations: ['roles'],
    });

    if (!adminExists) {
      const userAdmin = userRepo.create({
        first_name: 'Admin',
        last_name: 'User',
        is_active: true,
        email: 'admin@gmail.com',
        password: await hashPassword('11111111'),
        roles: [adminRole],
      });
      await userRepo.save(userAdmin);
    }

    await queryRunner.commitTransaction();
    console.log('✅ Auto-generate users success');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Auto-generate users failed:', err);
  } finally {
    await queryRunner.release();
  }
}
