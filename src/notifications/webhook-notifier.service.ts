// src/notifications/webhook-notifier.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WebhookNotifier {
  private readonly logger = new Logger(WebhookNotifier.name);

  async send(webhookUrl: string, payload: any): Promise<void> {
    try {
      await axios.post(webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });
      this.logger.log(`Webhook POST to ${webhookUrl} succeeded`);
    } catch (err) {
      this.logger.error(`Webhook POST to ${webhookUrl} failed`, err.stack || err);
    }
  }
}
