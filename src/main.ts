import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logging/winstonLogging';
import { AllExceptionFilter } from './common/errors/errorHandling';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

async function start() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

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

  // SuperAdmin yaratish
  const prisma = app.get(PrismaService);
  await createSuperAdmin(prisma, config);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Language CRM API')
    .setDescription('API documentation for Language CRM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT ?? 3030, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}

async function createSuperAdmin(prisma: PrismaService, config: ConfigService) {
  try {
    const username = config.get<string>('SUPER_ADMIN_USERNAME');
    const password = config.get<string>('SUPER_ADMIN_PASSWORD');
    const phone = config.get<string>('SUPER_ADMIN_PHONE');

    if (!username || !password || !phone) {
      console.log('⚠️ SuperAdmin env variables not set, skipping...');
      return;
    }

    const exists = await prisma.admin.findFirst({
      where: { role: 'superAdmin', isDeleted: false },
    });

    if (!exists) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.admin.create({
        data: {
          username,
          password: hashedPassword,
          role: 'superAdmin',
          phoneNumber: phone,
          isActive: true,
        },
      });
      console.log('✅ SuperAdmin yaratildi');
      console.log(`   Username: ${username}`);
    } else {
      console.log('ℹ️ SuperAdmin allaqachon mavjud');
    }
  } catch (error) {
    console.error('❌ SuperAdmin yaratishda xato:', error);
  }
}

start();
