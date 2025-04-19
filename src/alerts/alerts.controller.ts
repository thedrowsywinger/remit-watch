// src/alerts/alerts.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alerts')
@UseGuards(AuthGuard('jwt'))
export class AlertsController {
  constructor(private alerts: AlertsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Request() req, @Body() dto: CreateAlertDto) {
    return this.alerts.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.alerts.findAll(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req, @Param('id') id: string) {
    return this.alerts.remove(req.user.id, +id);
  }
}
