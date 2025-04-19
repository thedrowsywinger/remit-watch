// src/fx/fx.controller.ts
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { FxService } from './fx.service';

@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) { }

  /** 
   * 🔥 Manual trigger for BB scrape.
   * GET /fx/get-rate
   */
  @Get('rate')
  @HttpCode(HttpStatus.ACCEPTED)
  async triggerFetch() {
    await this.fxService.fetchLatest();
    return { message: 'Rate fetch triggered' };
  }

}
