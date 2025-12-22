import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrationScene } from './bot.scene';

@Module({
  imports: [],
  controllers: [],
  providers: [BotService, BotUpdate, PrismaService, RegistrationScene],
})
export class BotModule {}
