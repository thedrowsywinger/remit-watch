import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);

  console.log(`##############################`);
  console.log(`##############################`);
  console.log(`#                            #`);
  console.log(`#   RemitWatch API Server    #`);
  console.log(`#                            #`);
  console.log(`#   Listening on port: ${process.env.PORT ?? 3000}   #`);
  console.log(`#                            #`);
  console.log(`#   Environment: ${process.env.NODE_ENV ?? 'development'}   #`);
  console.log(`#                            #`);
  console.log(`#   Database: ${process.env.DB_HOST ?? 'localhost'}   #`);
  console.log(`#                            #`);
  console.log(`#   Database Port: ${process.env.DB_PORT ?? '3306'}   #`);
  console.log(`#                            #`);
  console.log(`#   Database Name: ${process.env.DB_DATABASE ?? 'remit_watch_db'}   #`);
  console.log(`#                            #`);
  console.log(`#   Database Username: ${process.env.DB_USERNAME ?? 'remitwatch'}   #`);
  console.log(`#                            #`);
  console.log(`#   Database Type: ${process.env.DB_TYPE ?? 'mysql'}   #`);
  console.log(`#                            #`);
  console.log(`#   Database Synchronize: ${process.env.DB_SYNCHRONIZE ?? 'true'}   #`);
  console.log(`#                            #`);
  console.log(`#   Database Logging: ${process.env.DB_LOGGING ?? 'false'}   #`);
  console.log(`#                            #`);
  console.log(`##############################`);
  console.log(`##############################`);
  console.log(`Starting application...`);
  console.log(`Connecting to database...`);
  console.log(`Database connected successfully!`);
}
bootstrap();
