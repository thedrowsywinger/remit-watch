// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FxModule } from './fx/fx.module';
import { AlertsModule } from './alerts/alerts.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
        username: config.get<string>('DB_USERNAME', 'remitwatch'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', 'remit_watch_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // disable in prod!
        logging: config.get<string>('NODE_ENV', 'development') === 'development',
      }),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    FxModule,
    AlertsModule,
    NotificationsModule
  ],
})
export class AppModule {}
