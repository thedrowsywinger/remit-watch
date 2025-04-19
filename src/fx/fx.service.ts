// src/fx/fx.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { FxRate } from '../entities/fx-rate.entity';
import { AlertsService } from '../alerts/alerts.service';
// import { parse } from 'csv-parse/sync'; // if you add CSV feeds later

@Injectable()
export class FxService {
  private readonly logger = new Logger(FxService.name);

  constructor(
    @InjectRepository(FxRate)
    private fxRepo: Repository<FxRate>,
    private alerts: AlertsService,  
  ) { }

  /**
   * Runs twice daily at 6:00 and 18:00
   * to scrape Bangladesh Bank’s inter‑bank rate page.
   */
  // @Cron('0 6,18 * * *')
  // @Cron(CronExpression.EVERY_12_HOURS)
  async fetchLatest() {
    this.logger.log('Fetching rate from open.er-api.com…');
    try {
      const resp = await axios.get('https://open.er-api.com/v6/latest/USD');
      if (resp.data.result !== 'success') {
        throw new Error(resp.data['error-type'] || 'unknown error');
      }

      const rate: number = resp.data.rates?.BDT;
      if (!rate || isNaN(rate)) {
        this.logger.error('BDT not found in response', JSON.stringify(resp.data));
        return;
      }

      const fx = this.fxRepo.create({
        pair: 'BDTUSD',
        rate,
        source: 'OpenERAPI',   // attribute per their TOS
      });
      const saved = await this.fxRepo.save(fx);
      this.logger.log(`Saved BDTUSD rate: ${rate}`);
      // now evaluate against all rules for this pair
      await this.alerts.evaluate({ pair: saved.pair, rate: +saved.rate });
      return { rate: fx.rate, timestamp: fx.timestamp };
    } catch (err) {
      this.logger.error('Open‑ER‑API fetch failed', err);
    }
  }
}
