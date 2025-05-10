// src/fx/entities/fx-rate.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('fx_rates')
export class FxRate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 7 })
  @Index('idx_pair_time')
  pair: string;               // e.g. 'BDTUSD'

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  rate: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Index('idx_timestamp')
  timestamp: Date;            // when we scraped it

  @Column({ length: 50 })
  @Index('idx_source')
  source: string;             // 'BB' or bank code
}

export enum CurrencyPair {
  BDT_USD = 'BDTUSD',
  BDT_EUR = 'BDTEUR',
  BDT_GBP = 'BDTGBP',
  BDT_AED = 'BDTAED',
  BDT_SAR = 'BDTSAR',
  BDT_SGD = 'BDTSGD',
  BDT_MYR = 'BDTMYR',
  BDT_INR = 'BDTINR'
}
