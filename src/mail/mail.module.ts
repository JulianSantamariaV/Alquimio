import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        // cuando sea real, usar gmail
        // host: 'smtp.gmail.com', // Cambia según tu proveedor
        // port: 587,
        // secure: false, // true para 465, false para otros
        // host: 'smtp.mail.yahoo.com', // Servidor SMTP de Yahoo
        // port: 465, // Puerto seguro de Yahoo
        // secure: true, // Yahoo requiere SSL
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAIL_USER, // Usa variables de entorno
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: { from: '"Soporte" <soporte@alquimio.com>' },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
