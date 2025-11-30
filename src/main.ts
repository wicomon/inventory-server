import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'debug', 'fatal','verbose']
  });
  const acceptedUrls = process.env.ACCEPTED_URLS?.split(', ');
  console.log({acceptedUrls})

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // console.log({acceptedUrls})
  app.enableCors({
    origin: {acceptedUrls},
  });

  // console.log(process.env.PORT);
  const PORT = process.env.PORT || '4030';
  await app.listen(PORT);
  console.log(`App running on port ${PORT}`);
}
bootstrap();
