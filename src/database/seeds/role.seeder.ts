import { DataSource } from 'typeorm';
import { RoleOrmEntity } from '../entities/role.orm-entity';

export async function seedRole(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const roleRepo = queryRunner.manager.getRepository(RoleOrmEntity);

    const roles = [
      { name: 'super-admin' },
      { name: 'admin' },
      { name: 'admin-hotel' },
      { name: 'user-hotel' },
    ];

    for (const role of roles) {
      const exists = await roleRepo.findOne({ where: { name: role.name } });
      if (!exists) {
        const newRole = roleRepo.create(role);
        await roleRepo.save(newRole);
      }
    }

    await queryRunner.commitTransaction();
    console.log('✅ Auto-generate roles success');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Auto-generate roles failed:', err);
  } finally {
    await queryRunner.release();
  }
}
