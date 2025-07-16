import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.APP_PORT!).then(() => {
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
