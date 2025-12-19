import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
// import { PrismaClient } from '../generated/prisma/client';
// import * as bcrypt from 'bcrypt';
import { winstonConfig } from './common/logging/winstonLogging';
import { AllExceptionFilter } from './common/errors/errorHandling';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function start() {
  ////
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  ////
  app.useGlobalFilters(new AllExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        console.error('Validation errors:', errors); // This will log the full details to your server console
        return new BadRequestException(errors); // Or customize the response
      },
      transform: true, // Enable auto-type conversion (highly recommended)
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on extra properties
    }),
  );

  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  const PORT = config.get<number>('PORT');
  app.use(cookieParser());

  // const prisma = new PrismaClient();
  // const rootExists = await prisma.rootUser.findUnique({
  //   where: { email: 'root@example.com' },
  // });

  // if (!rootExists) {
  //   const hashedPassword = await bcrypt.hash('12345', 10);
  //   await prisma.rootUser.create({
  //     data: {
  //       email: 'root@example.com',
  //       password: hashedPassword,
  //       full_name: 'Root Admin',
  //       is_creator: true,
  //     },
  //   });
  //   console.log('✅ Root user created');
  // } else {
  //   console.log('ℹ️ Root user already exists');
  // }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Rent service API')
    .setDescription('API documentation for Exam 4 and related entities')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT ?? 3030, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}
start();
