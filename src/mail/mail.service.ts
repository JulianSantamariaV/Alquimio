import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarCorreo(destino: string, asunto: string, contenido: string) {
    try {
      await this.mailerService.sendMail({
        to: destino,
        subject: asunto,
        text: contenido,
        html: `<p>${contenido}</p>`,
      });
      console.log('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error enviando correo:', error);
    }
  }
}
