// src/entities/alert-rule.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

export enum ThresholdType {
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt'
}

export enum AlertRuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('alert_rules')
export class AlertRule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  @Index('idx_user_status')
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 7 })
  @Index('idx_pair_status')
  pair: string;  // e.g. 'BDTUSD'

  @Column({
    type: 'enum',
    enum: ThresholdType,
    name: 'threshold_type'
  })
  thresholdType: ThresholdType;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'threshold_value' })
  thresholdValue: number;

  @Column({ type: 'json' })
  channels: string[];  // e.g. ['telegram','email']

  @Column({ name: 'webhook_url', length: 2048, nullable: true })
  webhookUrl?: string;

  @Column({ name: 'last_triggered', type: 'datetime', nullable: true })
  @Index('idx_last_triggered')
  lastTriggered?: Date;

  @Column({
    type: 'enum',
    enum: AlertRuleStatus,
    default: AlertRuleStatus.ACTIVE
  })
  @Index('idx_user_status')
  @Index('idx_pair_status')
  status: AlertRuleStatus;

  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;
}
