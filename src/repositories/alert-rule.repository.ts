import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';
import { AlertRule, AlertRuleStatus, ThresholdType } from '../entities/alert-rule.entity';
import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';

@Injectable()
export class AlertRuleRepository extends BaseRepository<AlertRule> {
  constructor(repository: Repository<AlertRule>) {
    super(repository);
  }

  async findByUserId(userId: number): Promise<AlertRule[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findActiveRules(): Promise<AlertRule[]> {
    return this.repository.find({
      where: { status: AlertRuleStatus.ACTIVE },
      relations: ['user']
    });
  }

  async findRulesByPair(pair: string): Promise<AlertRule[]> {
    return this.repository.find({
      where: { pair, status: AlertRuleStatus.ACTIVE },
      relations: ['user']
    });
  }

  async findRulesByThreshold(
    pair: string,
    threshold: number,
    thresholdType: ThresholdType
  ): Promise<AlertRule[]> {
    return this.repository.find({
      where: {
        pair,
        thresholdType,
        thresholdValue: thresholdType === ThresholdType.GREATER_THAN
          ? LessThanOrEqual(threshold)
          : MoreThanOrEqual(threshold),
        status: AlertRuleStatus.ACTIVE
      },
      relations: ['user']
    });
  }

  async findRulesNotTriggeredSince(date: Date): Promise<AlertRule[]> {
    return this.repository.find({
      where: [
        { lastTriggered: LessThanOrEqual(date) },
        { lastTriggered: IsNull() }
      ],
      relations: ['user']
    });
  }

  async updateLastTriggered(id: number, date: Date): Promise<AlertRule | null> {
    return this.update(id, { lastTriggered: date });
  }

  async updateStatus(id: number, status: AlertRuleStatus): Promise<AlertRule | null> {
    return this.update(id, { status });
  }
} 