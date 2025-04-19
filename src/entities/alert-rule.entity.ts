// src/entities/alert-rule.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type ThresholdType = 'gt' | 'lt';  // greater‑than or less‑than

@Entity('alert_rules')
export class AlertRule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 7 })
  pair: string;  // e.g. 'BDTUSD'

  @Column({ type: 'enum', enum: ['gt', 'lt'] })
  thresholdType: ThresholdType;

  @Column('decimal', { precision: 10, scale: 4 })
  thresholdValue: number;

  @Column('simple-json')
  channels: string[];  // e.g. ['telegram','email']

  @Column({ name: 'last_triggered', type: 'datetime', nullable: true })
  lastTriggered: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
