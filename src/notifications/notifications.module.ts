// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { TelegramNotifier } from './telegram-notifier.service';
import { WebhookNotifier } from './webhook-notifier.service';

@Module({
  providers: [TelegramNotifier, WebhookNotifier],
  exports: [TelegramNotifier, WebhookNotifier],
})
export class NotificationsModule {}
