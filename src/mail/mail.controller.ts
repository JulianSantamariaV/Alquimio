import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendEmail(@Body() body: { email: string; subject: string; message: string }) {
    await this.mailService.enviarCorreo(body.email, body.subject, body.message);
    return { message: 'Correo enviado' };
  }
}
