import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Query } from '@nestjs/graphql/dist/decorators';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @Query(() => String)
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('login')
  @Query(() => String)
  async login(username:string,password:string) {
    return await this.appService.login(username,password);
  }
}
//aca se exportan