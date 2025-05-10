import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CurrencyPair } from './fx-rate.entity';
import { ThresholdType } from './alert-rule.entity';

export enum RuleOperator {
  AND = 'AND',
  OR = 'OR'
}

export interface CompoundCondition {
  thresholdType: ThresholdType;
  thresholdValue: number;
  operator?: RuleOperator;
}

@Entity('alert_rule_templates')
export class AlertRuleTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: CurrencyPair,
    length: 7
  })
  @Index('idx_template_pair')
  pair: CurrencyPair;

  @Column({ type: 'json' })
  conditions: CompoundCondition[];

  @Column({ type: 'json' })
  channels: string[];

  @Column({ name: 'webhook_url', length: 2048, nullable: true })
  webhookUrl?: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: number;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
} 