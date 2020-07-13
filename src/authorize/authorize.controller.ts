import { Controller, Get, Post, Body, Res, Param, Query } from '@nestjs/common';
import { AuthorizeService } from './authorize.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Authorize')
@Controller('authorize')
export class AuthorizeController {
  constructor(private readonly authorizeService: AuthorizeService) {}

  @Post('/create-subscription')
  createSubSubscription(
    @Body() dto: CreateSubscriptionDto,
    @Res() res: Response,
  ) {
    this.authorizeService.createSubscription(dto, res);
  }

  @Post('/cancel-subscription/:id')
  cancelSubscription(@Param('id') id: string, @Res() res: Response) {
    this.authorizeService.cancelSubscription(id, res);
  }

  @Get('/subscription/:id')
  getSubscription(@Param('id') id: string, @Res() res: Response) {
    this.authorizeService.getSubscription(id, res);
  }

  @Get('/subscription-status/:id')
  getSubscriptionStatus(@Param('id') id: string, @Res() res: Response) {
    this.authorizeService.getSubscriptionStatus(id, res);
  }

  @Get('/subscription-list')
  listSubscriptions(@Res() res: Response) {
    this.authorizeService.getListOfSubscriptions(res);
  }
}
