import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
config();

const port = process.env.PORT;
const allowedOrigins = process.env.allowedOrigins.split(',');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ origin: allowedOrigins, credentials: true });
  await app.listen(port, () => console.log(`🛜   http://localhost:${port}`));
}
bootstrap();
