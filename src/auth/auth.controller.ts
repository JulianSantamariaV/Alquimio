import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string, // puede cambiarse a username
    @Body('password') password: string,
  ) {
    return await this.appService.login(email, password);
  }
  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('lastname') lastname: string,
    @Body('email') email: string,
  ) {
    return await this.appService.register(
      username,
      password,
      name,
      lastname,
      email,
    );
  }
}
