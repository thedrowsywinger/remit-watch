// src/admin/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';

@Controller('admin/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      // Checks that TypeORM can connect
      () => this.db.pingCheck('database'),
    ]);
  }
}
