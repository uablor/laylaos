import { DataSource, EntityManager } from 'typeorm';

export interface ITransactionManager {
  runInTransaction<T>(
    dataSource: DataSource,
    operations: (manager: EntityManager) => Promise<T>,
  ): Promise<T>;
}
