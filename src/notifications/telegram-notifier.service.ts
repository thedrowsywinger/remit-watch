// src/notifications/telegram-notifier.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Agent as HttpsAgent } from 'https';

@Injectable()
export class TelegramNotifier implements OnModuleInit {
  private readonly logger = new Logger(TelegramNotifier.name);
  private apiUrl: string;
  private defaultChatId: string;

  constructor(private cfg: ConfigService) {}

  onModuleInit() {
    const token = this.cfg.get<string>('TELEGRAM_BOT_TOKEN');
    console.log("🚀 ~ telegram-notifier.service.ts:16 ~ TelegramNotifier ~ onModuleInit ~ token:", token);
    const chatId = this.cfg.get<string>('TELEGRAM_DEFAULT_CHAT_ID');
    console.log("🚀 ~ telegram-notifier.service.ts:18 ~ TelegramNotifier ~ onModuleInit ~ chatId:", chatId);
    if (!token) {
      this.logger.error('Missing TELEGRAM_BOT_TOKEN env var');
      throw new Error('TELEGRAM_BOT_TOKEN is required');
    }
    if (!chatId) {
      this.logger.error('Missing TELEGRAM_DEFAULT_CHAT_ID env var');
      throw new Error('TELEGRAM_DEFAULT_CHAT_ID is required');
    }

    this.apiUrl = `https://api.telegram.org/bot${token}`;
    this.defaultChatId = chatId;
    this.logger.log('TelegramNotifier initialized');
  }

  async sendMessage(
    message: string,
    chatId?: string,
  ): Promise<void> {
    const target = chatId || this.defaultChatId;
    const url = `${this.apiUrl}/sendMessage`;
    const params = { chat_id: target, text: message, parse_mode: 'Markdown' };

    // Force IPv4
    const httpsAgent = new HttpsAgent({ family: 4 });

    try {
      const resp = await axios.get(url, {
        params,
        httpsAgent,
        timeout: 10000,  // 10 s timeout
      });
      if (!resp.data.ok) {
        this.logger.error('Telegram API error', JSON.stringify(resp.data));
      } else {
        this.logger.log('Telegram alert sent successfully');
      }
    } catch (err) {
      this.logger.error('Failed to send Telegram message', err);
    }
  }
}
