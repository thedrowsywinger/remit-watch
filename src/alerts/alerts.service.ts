// src/alerts/alerts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AlertRule } from '../entities/alert-rule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAlertDto } from './dto/create-alert.dto';
import { TelegramNotifier } from '../notifications/telegram-notifier.service';
import { WebhookNotifier } from '../notifications/webhook-notifier.service';
import { MetricsService } from '../metrics/metrics.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(AlertRule)
    private alertsRepo: Repository<AlertRule>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private telegram: TelegramNotifier,
    private webhook: WebhookNotifier,
    private metrics: MetricsService
  ) {}

  async create(userId: number, dto: CreateAlertDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const rule = new AlertRule();
    rule.pair = dto.pair;
    rule.thresholdType = dto.thresholdType as import('../entities/alert-rule.entity').ThresholdType;
    rule.thresholdValue = dto.thresholdValue;
    rule.channels = dto.channels;
    rule.webhookUrl = dto.webhookUrl;
    rule.lastTriggered = undefined;
    rule.user = user;
    return this.alertsRepo.save(rule);
  }

  findAll(userId: number) {
    return this.alertsRepo.find({ where: { user: { id: userId } } });
  }

  async remove(userId: number, id: number) {
    const result = await this.alertsRepo.delete({ id, user: { id: userId } });
    if (result.affected === 0) {
      throw new NotFoundException(`Alert rule ${id} not found`);
    }
  }

  /**
   * Evaluate a new rate against all rules for its pair.
   * Call this from FxService after saving a rate.
   */
  async evaluate(rate: { pair: string; rate: number }) {
    const rules = await this.alertsRepo.find({ where: { pair: rate.pair } });
    for (const rule of rules) {
      this.metrics.alertsEvaluated.inc();
      let triggered = false;
      if (rule.thresholdType === 'gt' && rate.rate > +rule.thresholdValue) {
        triggered = true;
      } else if (rule.thresholdType === 'lt' && rate.rate < +rule.thresholdValue) {
        triggered = true;
      }
      if (triggered) {
        this.metrics.alertsTriggered.inc();
        // TODO: send notifications via channels in rule.channels[]
        // e.g. this.notifyTelegram(...), this.notifyEmail(...)
        const msg = [
          '📊 *RemitWatch FX Alert*',
          `*Alert ID*: ${rule.id}`,
          `*Currency Pair*: ${rate.pair}`,
          `*Condition*: ${rule.thresholdType === 'gt' ? 'Rate exceeds' : 'Rate falls below'} ${rule.thresholdValue}`,
          `*Current Rate*: ${rate.rate}`,
          `*Timestamp*: ${new Date().toLocaleString()}`,
        ].join('\n');

        // Build a payload/message
        const payload = {
          alertId: rule.id,
          pair: rate.pair,
          thresholdType: rule.thresholdType,
          thresholdValue: +rule.thresholdValue,
          currentRate: rate.rate,
          timestamp: new Date().toISOString(),
        };
        
                  
        if (rule.channels.includes('telegram')) {
          await this.telegram.sendMessage(msg);
        }

        // Webhook
        if (rule.channels.includes('webhook') && rule.webhookUrl) {
          await this.webhook.send(rule.webhookUrl, payload);
        }
  
        // TODO: handle other channels (email, webhook) here...

        // update lastTriggered to prevent duplicate alerts
        rule.lastTriggered = new Date();
        await this.alertsRepo.save(rule);
        // log for now:
        console.log(`Rule ${rule.id} triggered: ${rate.pair} ${rate.rate}`);
      }
    }
  }
}
