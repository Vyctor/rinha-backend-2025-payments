import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();
  app.useBodyParser('json');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.APP_PORT!, '0.0.0.0').then(() => {
    console.log(
      `Application is running on: http://localhost:${process.env.APP_PORT}`,
    );
  });
}

bootstrap()
  .then(() => {})
  .catch((error) => {
    console.log(error);
  });
