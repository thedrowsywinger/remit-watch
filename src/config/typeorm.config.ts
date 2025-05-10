import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { FxRate } from '../entities/fx-rate.entity';
import { User } from '../entities/user.entity';
import { AlertRule } from '../entities/alert-rule.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'remit_watch',
  entities: [FxRate, User, AlertRule],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  // Enable soft deletes globally
  extra: {
    // This will automatically add WHERE deleted_at IS NULL to all queries
    // unless explicitly overridden
    softDelete: true,
  },
}; 