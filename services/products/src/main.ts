﻿import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 Microservicio corriendo en http://localhost:${port}`);
}

bootstrap();
