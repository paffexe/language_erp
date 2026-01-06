import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logging/winstonLogging';
import { AllExceptionFilter } from './common/errors/errorHandling';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function start() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  app.enableCors();

  app.useGlobalFilters(new AllExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        console.error('Validation errors:', errors);
        return new BadRequestException(errors);
      },
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  const PORT = config.get<number>('PORT');
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Language CRM API')
    .setDescription('API documentation for Language CRM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const sessionFile = './session_db.json';
  if (fs.existsSync(sessionFile)) {
    const stats = fs.statSync(sessionFile);
    const fileAge = Date.now() - stats.mtimeMs;
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (fileAge > oneWeek) {
      fs.unlinkSync(sessionFile);
      console.log('🗑️ Old session file cleaned (older than 1 week)');
    } else {
      console.log('🗃️ Session file is recent, no cleanup needed');
    }
  }

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT ?? 3030, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}

start();
