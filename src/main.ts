import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from './shared/helpers/env.helper';
import colors = require('colors/safe');
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());
  app.use(
    rateLimit({
      windowMs: 10 * 1000 * 60,
      max: 1000,
      message: 'Too many requests from this IP, please try again in 10 minutes',
    }),
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(Env.getNumber('PORT'));

  if (Env.getString('NODE_ENV') === 'development') {
    const url = `\n App is running: http://localhost:${Env.getNumber('PORT')}`;
    console.log(colors.green(url));
  }
}
bootstrap();
