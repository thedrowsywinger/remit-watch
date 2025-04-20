// src/alerts/alerts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertRule } from '../entities/alert-rule.entity';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [TypeOrmModule.forFeature([AlertRule]), NotificationsModule, MetricsModule],
  providers: [AlertsService],
  controllers: [AlertsController],
  exports: [AlertsService],
})
export class AlertsModule {}
