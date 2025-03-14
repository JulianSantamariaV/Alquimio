import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express'; // 🟢 Importar Response de Express

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string, // puede cambiarse a username
    @Body('password') password: string,
    @Res() response: Response, // 🟢 Pasar el Response de Express
  ) {
    const { accessToken, res } = await this.appService.login(email, password, response);
    return res.json(accessToken);
  }
  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('lastname') lastname: string,
    @Body('email') email: string,
    @Res() response: Response,
  ) {
    const { accessToken, res } = await this.appService.register(
      username,
      password,
      name,
      lastname,
      email,
      response,
    );
    return res.json(accessToken);
  }
  @Post('refreshToken')
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const { accessToken, res } = await this.appService.refreshToken(
      request,
      response,
    );
    return res.json(accessToken);
  }
}
