// src/fx/fx.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Now import from the central entities folder:
import { FxRate } from '../entities/fx-rate.entity';
import { FxService } from './fx.service';
import { FxController } from './fx.controller';
import { AlertsModule } from '../alerts/alerts.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [TypeOrmModule.forFeature([FxRate]), AlertsModule, MetricsModule],
  providers: [FxService],
  controllers: [FxController],
  exports: [FxService],
})
export class FxModule {}
