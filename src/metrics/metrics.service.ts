// src/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { Counter, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService {
  private registry = new Registry();

  // counters
  fxScrapes = new Counter({
    name: 'remitwatch_fx_scrapes_total',
    help: 'Number of FX scrapes performed',
    registers: [this.registry],
  });
  fxErrors = new Counter({
    name: 'remitwatch_fx_scrape_errors_total',
    help: 'Number of errors during FX scrape',
    registers: [this.registry],
  });
  alertsEvaluated = new Counter({
    name: 'remitwatch_alerts_evaluated_total',
    help: 'Number of alerts evaluated',
    registers: [this.registry],
  });
  alertsTriggered = new Counter({
    name: 'remitwatch_alerts_triggered_total',
    help: 'Number of alerts triggered',
    registers: [this.registry],
  });

  constructor() {
    // include Node.js process metrics (memory, CPU, etc.)
    collectDefaultMetrics({ register: this.registry });
  }

  // Expose the raw Prometheus metrics
  async metrics(): Promise<string> {
    return await this.registry.metrics();
  }
}
