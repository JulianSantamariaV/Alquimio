import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Query } from '@nestjs/graphql/dist/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Query(() => String)
  getHello(): string {
    return this.appService.getHello();
  }
}
