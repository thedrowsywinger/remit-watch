import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { FxRate } from '../entities/fx-rate.entity';
import { User } from '../entities/user.entity';
import { AlertRule } from '../entities/alert-rule.entity';
import { FxRateRepository } from '../repositories/fx-rate.repository';
import { UserRepository } from '../repositories/user.repository';
import { AlertRuleRepository } from '../repositories/alert-rule.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([FxRate, User, AlertRule])
  ],
  providers: [
    {
      provide: 'FxRateRepository',
      useFactory: (repository) => new FxRateRepository(repository),
      inject: ['FxRateRepository']
    },
    {
      provide: 'UserRepository',
      useFactory: (repository) => new UserRepository(repository),
      inject: ['UserRepository']
    },
    {
      provide: 'AlertRuleRepository',
      useFactory: (repository) => new AlertRuleRepository(repository),
      inject: ['AlertRuleRepository']
    }
  ],
  exports: ['FxRateRepository', 'UserRepository', 'AlertRuleRepository']
})
export class DatabaseModule {} 