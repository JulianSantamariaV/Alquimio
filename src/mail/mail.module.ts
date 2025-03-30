import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Cambia según tu proveedor
        port: 587,
        secure: false, // true para 465, false para otros
        auth: {
          user: process.env.MAIL_USER, // Usa variables de entorno
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"Soporte" <soporte@tuapp.com>',
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}