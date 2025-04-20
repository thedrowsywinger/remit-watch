// src/alerts/dto/create-alert.dto.ts
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ArrayNotEmpty,
  Matches,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @Matches(/^[A-Z]{3}[A-Z]{3}$/, {
    message: 'pair must be in format “XXXYYY” e.g. BDTUSD',
  })
  pair: string;

  @IsIn(['gt', 'lt'])
  thresholdType: 'gt' | 'lt';

  @IsNumber()
  thresholdValue: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(['telegram', 'email', 'webhook'], { each: true })
  channels: string[];

  @IsOptional()
  @IsUrl({}, { message: 'webhookUrl must be a valid URL' })
  webhookUrl?: string;
}
