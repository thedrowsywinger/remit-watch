// src/fx/entities/fx-rate.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('fx_rates')
@Index(['pair', 'timestamp'])
export class FxRate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 7 })
  pair: string;               // e.g. 'BDTUSD'

  @Column('decimal', { precision: 10, scale: 4 })
  rate: number;

  @Column({ length: 50 })
  source: string;             // 'BB' or bank code

  @CreateDateColumn()
  timestamp: Date;            // when we scraped it
}
