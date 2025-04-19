// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { TelegramNotifier } from './telegram-notifier.service';

@Module({
  providers: [TelegramNotifier],
  exports: [TelegramNotifier],
})
export class NotificationsModule {}
